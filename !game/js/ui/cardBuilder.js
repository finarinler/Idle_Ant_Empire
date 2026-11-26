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
        stepper: { label, canDec, canInc, dec, inc },   // optional: Zielstufe wählen (− / +)
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
        built: "button.built",
        training: "button.training"
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

    function hidePreview(nodes)
    {
        if (nodes.preview) { nodes.preview.hidden = true; }
    }

    function showPreview(entry, nodes, requested)
    {
        if (!nodes.preview || !entry.action.preview) { return; }
        let quantity = requested === "max" ? entry.action.batchOptions().max : Number(requested);
        if (!Number.isFinite(quantity) || quantity < 1) { hidePreview(nodes); return; }
        const preview = Economy.getActionPreview(entry.action.preview.kind, entry.action.preview.id, quantity);
        if (!preview.quantity) { hidePreview(nodes); return; }

        const lines = [];
        const unit = preview.quantity === 1 ? "" : ` · ${preview.quantity}×`;
        lines.push(`${I18N.t("tooltip.preview.effect")}${unit}`);
        const resourceNames = { food: "F", larvae: "L", ants: "A", queens: "K" };
        RESOURCE_IDS.forEach(resource =>
        {
            const produced = preview.produced[resource];
            const consumed = preview.consumed[resource];
            if (produced && produced.isPositive()) { lines.push(`+${formatRate(produced)} ${resourceNames[resource]}/s`); }
            if (consumed && consumed.isPositive()) { lines.push(`−${formatRate(consumed)} ${resourceNames[resource]}/s`); }
            const capacity = preview.capacity[resource];
            if (capacity && capacity.isPositive()) { lines.push(`+${formatGameNumber(capacity)} ${resourceNames[resource]} ${I18N.t("tooltip.preview.capacity")}`); }
        });

        lines.push(I18N.t("tooltip.preview.cost"));
        Object.keys(resourceNames).forEach(resource =>
        {
            const value = preview.costs[resource];
            if (value && value.isPositive()) { lines.push(`${formatGameNumber(value)} ${resourceNames[resource]}`); }
        });
        lines.push(`${I18N.t(entry.action.preview.kind === "unit" ? "card.stat.trainingTime" : "card.stat.buildTime")}: ${formatDuration(preview.seconds)}`);
        nodes.preview.textContent = "";
        lines.forEach((line, index) =>
        {
            const row = document.createElement("div");
            row.textContent = line;
            if (index === 0 || line === I18N.t("tooltip.preview.cost")) { row.className = "iae-card-preview-heading"; }
            nodes.preview.appendChild(row);
        });
        nodes.preview.hidden = false;
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
                    row,
                    label: create("span", null, row),
                    value: create("strong", null, row)
                });
            });
        }

        const costBlock = create("div", "iae-card-cost", card);
        nodes.costBlock = costBlock;
        nodes.costLabel = create("span", "iae-card-label", costBlock);
        nodes.cost = create("div", "iae-card-cost-line", costBlock, { id: `${entry.id}-cost-display` });

        // Fester Platzhalter sorgt dafür, dass Kosten, Fortschritt und Button
        // unabhängig von der Anzahl der Stat-Zeilen immer an derselben Stelle sitzen.
        const progress = create("div", "iae-card-progress iae-card-progress-slot", card);
        nodes.progress = progress;

        if (entry.progressId)
        {
            const track = create("div", "iae-card-progress-track", progress);
            create("div", "iae-card-progress-fill", track, { id: entry.progressId });
        }
        else if (entry.trainingProgressId)
        {
            progress.classList.add("iae-card-training-progress");
            const track = create("div", "iae-card-progress-track", progress);
            create("div", "iae-card-progress-fill iae-card-training-progress-fill", track, { id: entry.trainingProgressId });
        }

        if (entry.stepper)
        {
            const stepper = create("div", "iae-card-stepper", card);
            nodes.stepperDec = create("button", "iae-card-stepper-btn", stepper, { type: "button", "aria-label": "−" });
            nodes.stepperDec.textContent = "−";
            nodes.stepperLabel = create("span", "iae-card-stepper-label", stepper);
            nodes.stepperInc = create("button", "iae-card-stepper-btn", stepper, { type: "button", "aria-label": "+" });
            nodes.stepperInc.textContent = "+";
            nodes.stepperDec.addEventListener("click", () => entry.stepper.dec());
            nodes.stepperInc.addEventListener("click", () => entry.stepper.inc());
        }

        nodes.button = create("button", "iae-card-action", card, { type: "button", id: `buy-${entry.id}-btn` });
        nodes.buttonLabel = create("span", "iae-card-action-label", nodes.button);
        create("span", "iae-card-action-glyph", nodes.button, { "aria-hidden": "true" });

        if (entry.action && typeof entry.action.run === "function")
        {
            nodes.button.addEventListener("click", () => entry.action.run());
        }
        if (entry.action && entry.action.preview)
        {
            nodes.button.dataset.previewQuantity = "1";
            nodes.button.addEventListener("mouseenter", () => showPreview(entry, nodes, 1));
            nodes.button.addEventListener("focus", () => showPreview(entry, nodes, 1));
            nodes.button.addEventListener("blur", () => hidePreview(nodes));
        }

        if (entry.action && typeof entry.action.batchOptions === "function" && typeof entry.action.batchRun === "function")
        {
            nodes.batch = create("div", "iae-card-batch-actions", card);
            nodes.batchButtons = {};
            [["10", 10], ["25", 25], ["MAX", "max"]].forEach(([label, amount]) =>
            {
                const button = create("button", "iae-card-batch-btn", nodes.batch, { type: "button" });
                button.textContent = label;
                button.addEventListener("click", () => entry.action.batchRun(amount));
                if (entry.action.preview)
                {
                    button.addEventListener("mouseenter", () => showPreview(entry, nodes, amount));
                    button.addEventListener("focus", () => showPreview(entry, nodes, amount));
                    button.addEventListener("blur", () => hidePreview(nodes));
                }
                nodes.batchButtons[label] = button;
            });
        }

        if (entry.action && entry.action.preview)
        {
            nodes.preview = create("div", "iae-card-preview", card, { role: "tooltip", "aria-live": "polite" });
            nodes.preview.hidden = true;
            card.addEventListener("mouseleave", () => hidePreview(nodes));
        }

        nodes.hint = create("p", "iae-card-hint", card);

        return nodes;
    }

    /* ---------- Karte aktualisieren ---------- */

    function updateCard(entry, nodes)
    {
        const status = entry.status ? entry.status() : { state: "available" };
        const state = status.state || "available";

        if (typeof entry.visible === "function")
        {
            nodes.card.style.display = entry.visible() ? "" : "none";
        }

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

            // Positive Effekte bleiben grün; negative Werte werden als Warnung markiert.
            // Explizit positive Boni (z. B. Zeitersparnis mit Minuszeichen) behalten Vorrang.
            const valueText = nodes.stats[index].value.textContent.trim();
            const isNegative = !stat.tone && /^[−-]/.test(valueText);
            nodes.stats[index].row.classList.toggle("tone-positive", stat.tone === "positive");
            nodes.stats[index].row.classList.toggle("tone-negative", isNegative);
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

        // Bei dauerhaft ausgeschöpften Karten sind Kosten und Fortschritt nicht mehr relevant.
        const limitReached = state === "max" || state === "built";
        nodes.costBlock.hidden = limitReached;
        nodes.progress.hidden = limitReached;

        const action = entry.action || {};
        let label = action.label;

        if (state === "missing" && action.missingLabel)
        {
            label = action.missingLabel;
        }
        else if (state === "training")
        {
            label = { key: STATE_LABEL_KEYS.training };
        }
        else if (STATE_LABEL_KEYS[state] && !action.keepLabel)
        {
            label = { key: STATE_LABEL_KEYS[state] };
        }

        setText(nodes.buttonLabel, label);
        nodes.button.disabled = state !== "available";

        setText(nodes.hint, status.hint || "");

        if (nodes.batchButtons)
        {
            const options = entry.action.batchOptions();
            const canUse = state !== "locked" && state !== "max" && state !== "built" && state !== "soon";
            nodes.batchButtons["10"].hidden = !canUse || !options.ten;
            nodes.batchButtons["25"].hidden = !canUse || !options.twentyFive;
            nodes.batchButtons.MAX.hidden = !canUse || options.max < 26;
        }

        if (entry.stepper)
        {
            setText(nodes.stepperLabel, entry.stepper.label);
            nodes.stepperDec.disabled = !entry.stepper.canDec();
            nodes.stepperInc.disabled = !entry.stepper.canInc();
        }

        STATE_CLASSES.forEach(name => nodes.card.classList.toggle(`is-${name}`, name === state));
        nodes.card.dataset.state = state;
    }

    const STATE_CLASSES = ["available", "missing", "locked", "max", "built", "soon", "training"];

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
