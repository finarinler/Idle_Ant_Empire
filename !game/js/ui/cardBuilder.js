/* =========================================================
    Karten-Baukasten
    Gemeinsamer Renderer für alle Kaufkarten (Einheiten, Gebäude,
    Forschungs-Einträge). Optisch verbindliche Vorlage: Forschungskarte.

    Die Daten kommen aus den Katalogen (units/js/unitCatalog.js,
    structures/js/structureCatalog.js, research/js/researchPanel.js).
    Ein Katalog-Eintrag beschreibt nur Daten und Aktionen:

    {
        id, group,                 // group = data-card-group des Ziel-Containers
        icon, symbolClass, type, name, desc,    // Textangaben: "Text" | { key, params } | Funktion dazu
        startsHidden,              // Karte beim Start ausblenden (z. B. Kundschafterin)
        count: { value, max },     // Bestandsanzeige oben rechts (optional)
        stats: [{ label, value, tone }],
        costLabel,                 // optional, Standard: card.label.cost
        cost,                      // () => ({ values, order }) | Textangabe
        progressId,                // optionaler Fortschrittsbalken (ID bleibt für eigene Logik)
        action: { label, missingLabel, keepLabel, run },
        status                     // () => ({ state, hint }); state: available | missing |
                                   //   locked | max | built | soon
    }

    Alle Texte werden bei Änderung neu gesetzt (Sprachwechsel inklusive).
    Platzhalter [[F]] / \n werden von I18N.renderInto aufgelöst.
========================================================= */

const CardBuilder = (function ()
{
    "use strict";

    const groups = new Map();   // Gruppen-ID -> Einträge
    const mounted = [];         // { entry, nodes }

    const STATE_LABEL_KEYS = {
        locked: "button.locked",
        soon: "button.locked",
        max: "button.maxReached",
        built: "button.built"
    };

    /* ---------- Hilfsfunktionen ---------- */

    function resolve(value)
    {
        return typeof value === "function" ? value() : value;
    }

    function toText(spec)
    {
        const value = resolve(spec);

        if (value === null || value === undefined)
        {
            return "";
        }

        if (typeof value === "object")
        {
            return typeof value.key === "string" ? I18N.t(value.key, value.params) : String(value.text ?? "");
        }

        return String(value);
    }

    function setText(node, spec)
    {
        if (!node)
        {
            return;
        }

        const text = toText(spec);

        if (node._cardText === text)
        {
            return;
        }

        node._cardText = text;
        I18N.renderInto(node, text);
    }

    function create(tag, className, parent, attributes)
    {
        const node = document.createElement(tag);

        if (className)
        {
            node.className = className;
        }

        if (attributes)
        {
            Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
        }

        if (parent)
        {
            parent.appendChild(node);
        }

        return node;
    }

    /* ---------- Karte erzeugen ---------- */

    function buildCard(entry)
    {
        const nodes = {};

        const card = create("article", "iae-card", null, { id: `card-${entry.id}`, "data-card": entry.id });
        nodes.card = card;

        if (entry.startsHidden)
        {
            card.style.display = "none";
        }

        const top = create("div", "iae-card-top", card);
        const symbol = create("div", `iae-card-symbol${entry.symbolClass ? " " + entry.symbolClass : ""}`, top, { "aria-hidden": "true" });
        symbol.textContent = entry.icon || "♟";
        nodes.type = create("span", "iae-card-type", top);

        const titleRow = create("div", "iae-card-title-row", card);
        const titleBlock = create("div", "iae-card-title-block", titleRow);
        nodes.name = create("h3", "iae-card-name", titleBlock);
        nodes.desc = create("p", "iae-card-desc", titleBlock);

        if (entry.count)
        {
            const pill = create("span", "iae-card-count", titleRow);
            nodes.count = create("span", null, pill, { id: `${entry.id}-count` });
            nodes.countMax = create("span", "iae-card-count-max", pill);
        }

        nodes.stats = [];

        if (entry.stats && entry.stats.length)
        {
            const stats = create("div", "iae-card-stats", card);

            entry.stats.forEach(stat =>
            {
                const row = create("div", `iae-card-stat${stat.tone ? " tone-" + stat.tone : ""}`, stats);
                nodes.stats.push({
                    label: create("span", null, row),
                    value: create("strong", null, row)
                });
            });
        }

        const costBlock = create("div", "iae-card-cost", card);
        nodes.costLabel = create("span", "iae-card-label", costBlock);
        nodes.cost = create("div", "iae-card-cost-line", costBlock, { id: `${entry.id}-cost-display` });

        if (entry.progressId)
        {
            const progress = create("div", "iae-card-progress", card);
            const track = create("div", "iae-card-progress-track", progress);
            create("div", "iae-card-progress-fill", track, { id: entry.progressId });
        }

        nodes.button = create("button", "iae-card-action", card, { type: "button", id: `buy-${entry.id}-btn` });
        nodes.buttonLabel = create("span", "iae-card-action-label", nodes.button);
        create("span", "iae-card-action-glyph", nodes.button, { "aria-hidden": "true" });

        if (entry.action && typeof entry.action.run === "function")
        {
            nodes.button.addEventListener("click", () => entry.action.run());
        }

        nodes.hint = create("p", "iae-card-hint", card);

        return nodes;
    }

    /* ---------- Karte aktualisieren ---------- */

    function updateCard(entry, nodes)
    {
        const status = entry.status ? entry.status() : { state: "available" };
        const state = status.state || "available";

        setText(nodes.type, entry.type);
        setText(nodes.name, entry.name);
        setText(nodes.desc, entry.desc);

        if (nodes.count)
        {
            setText(nodes.count, entry.count.value);

            const max = entry.count.max === undefined ? "" : toText(entry.count.max);
            setText(nodes.countMax, max === "" ? "" : ` / ${max}`);
        }

        (entry.stats || []).forEach((stat, index) =>
        {
            setText(nodes.stats[index].label, stat.label);
            setText(nodes.stats[index].value, stat.value);
        });

        setText(nodes.costLabel, entry.costLabel || { key: "card.label.cost" });

        const cost = resolve(entry.cost);

        if (cost && cost.values)
        {
            renderCostLine(nodes.cost, cost.values, cost.order);
        }
        else
        {
            nodes.cost.removeAttribute("data-cost-signature");
            setText(nodes.cost, cost);
        }

        const action = entry.action || {};
        let label = action.label;

        if (state === "missing" && action.missingLabel)
        {
            label = action.missingLabel;
        }
        else if (STATE_LABEL_KEYS[state] && !action.keepLabel)
        {
            label = { key: STATE_LABEL_KEYS[state] };
        }

        setText(nodes.buttonLabel, label);
        nodes.button.disabled = state !== "available";

        setText(nodes.hint, status.hint || "");

        STATE_CLASSES.forEach(name => nodes.card.classList.toggle(`is-${name}`, name === state));
        nodes.card.dataset.state = state;
    }

    const STATE_CLASSES = ["available", "missing", "locked", "max", "built", "soon"];

    /* ---------- Öffentliche Schnittstelle ---------- */

    function register(groupId, entries)
    {
        const list = groups.get(groupId) || [];
        groups.set(groupId, list.concat(entries.map(entry => Object.assign({ group: groupId }, entry))));
    }

    function mountAll()
    {
        groups.forEach((entries, groupId) =>
        {
            const container = document.querySelector(`[data-card-group="${groupId}"]`);

            if (!container || container.dataset.cardsMounted)
            {
                return;
            }

            container.dataset.cardsMounted = "true";

            entries.forEach(entry =>
            {
                const nodes = buildCard(entry);
                container.appendChild(nodes.card);
                mounted.push({ entry, nodes });
            });
        });

        updateAll();
    }

    function updateAll()
    {
        mounted.forEach(({ entry, nodes }) =>
        {
            try
            {
                updateCard(entry, nodes);
            }
            catch (error)
            {
                console.error(`[CardBuilder] Karte "${entry.id}" konnte nicht aktualisiert werden:`, error);
            }
        });
    }

    return { register, mountAll, updateAll };
})();
