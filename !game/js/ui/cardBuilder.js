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
        startsHidden,              // Karte beim Start ausblenden (falls erforderlich)
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
    const PREVIEW_ENABLED_KEY = "iae_action_tooltips_enabled";
    let previewsEnabled = (() => { try { return localStorage.getItem(PREVIEW_ENABLED_KEY) !== "false"; } catch (_) { return true; } })();

    function statPriority(stat)
    {
        const key = stat && stat.label && stat.label.key || "";
        // Produktionswert -> zugehöriger Bonus -> Verbrauch -> Gesamtproduktion -> Rest.
        if (key === "card.stat.foodProduction" || key === "card.stat.larvaeProduction") { return 0; }
        if (/bonus/i.test(key)) { return 1; }
        if (key === "card.stat.foodConsumption" || key === "card.stat.upkeep") { return 2; }
        if (key === "card.stat.totalProduction") { return 3; }
        return 4;
    }

    function orderedStats(stats)
    {
        return (stats || []).map((stat, index) => ({ stat, index }))
            .sort((a, b) => statPriority(a.stat) - statPriority(b.stat) || a.index - b.index)
            .map(item => item.stat);
    }

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

    function positionPreview(nodes, event)
    {
        if (!nodes.preview || nodes.preview.hidden || !event) { return; }
        const offset = 18;
        const rect = nodes.preview.getBoundingClientRect();
        const left = Math.min(event.clientX + offset, window.innerWidth - rect.width - 10);
        const top = Math.min(event.clientY + offset, window.innerHeight - rect.height - 10);
        nodes.preview.style.left = Math.max(10, left) + "px";
        nodes.preview.style.top = Math.max(10, top) + "px";
    }

    function hidePreview(nodes)
    {
        if (!nodes.preview) { return; }
        nodes.preview.hidden = true;
        if (nodes.previewMoveHandler)
        {
            document.removeEventListener("mousemove", nodes.previewMoveHandler);
            nodes.previewMoveHandler = null;
        }
    }

    function showPreview(entry, nodes, requested, event)
    {
        if (!previewsEnabled || !nodes.preview || !entry.action.preview || (entry.id === "scout" && hasScout())) { return; }
        let quantity = requested === "max" ? entry.action.batchOptions().max : Number(requested);
        if (!Number.isFinite(quantity) || quantity < 1) { hidePreview(nodes); return; }
        const preview = Economy.getActionPreview(entry.action.preview.kind, entry.action.preview.id, quantity);
        if (!preview.quantity) { hidePreview(nodes); return; }

        const productionLines = [];
        const consumptionLines = [];
        const otherLines = [];
        const timeLines = [];
        const unit = preview.quantity === 1 ? "" : ` · ${preview.quantity}×`;
        const resourceNames = { food: "F", larvae: "L", ants: "A", queens: "K" };

        RESOURCE_IDS.forEach(resource =>
        {
            const produced = preview.produced[resource];
            const consumed = preview.consumed[resource];
            if (produced && produced.isPositive())
            {
                productionLines.push({ text: `${I18N.t("tooltip.preview.production." + resource)}: +${formatRate(produced)} ${resourceNames[resource]}/s`, tone: "production" });
            }
            if (consumed && consumed.isPositive())
            {
                consumptionLines.push({ text: `${I18N.t("tooltip.preview.consumption." + resource)}: −${formatRate(consumed)} ${resourceNames[resource]}/s`, tone: "consumption" });
            }
            const capacity = preview.capacity[resource];
            if (capacity && capacity.isPositive())
            {
                otherLines.push({ text: `+${formatGameNumber(capacity)}`, abbreviation: resourceNames[resource] , suffix: ` ${I18N.t("tooltip.preview.capacity")}` });
            }
        });

        if (entry.action.preview.kind === "unit")
        {
            const unitDef = UnitRegistry.get(entry.action.preview.id);
            if (unitDef.housing > 0) { otherLines.push({ text: I18N.t("tooltip.preview.housingUsed") + ": +" + formatGameNumber(unitDef.housing * preview.quantity), abbreviation: "A" }); }
            if (entry.action.preview.id === "builder")
            {
                const before = Economy.getUnitNumber("builder");
                const after = Math.min(BALANCE.builder.maxBuilders, before + preview.quantity);
                const reduction = (after - before) * BALANCE.builder.reductionPerBuilder;
                if (reduction > 0) { otherLines.push({ text: I18N.t("tooltip.preview.buildSpeed") + ": −" + formatDecimal(reduction * 100, 1) + " %" }); }
            }
        }
        else if (entry.action.preview.id === "housing-chamber") { otherLines.push({ text: I18N.t("tooltip.preview.housingCapacity") + ": +" + formatGameNumber(Economy.getHousingPerChamber() * preview.quantity), abbreviation: "A" }); }
        else if (entry.action.preview.id === "construction-chamber") { otherLines.push({ text: I18N.t("tooltip.preview.builderLimit") + ": +" + formatGameNumber(preview.quantity) }); }

        const costLines = [];
        Object.keys(resourceNames).forEach(resource =>
        {
            const value = preview.costs[resource];
            if (!value || !value.isPositive()) { return; }
            const label = resource === "food" ? I18N.t("resource.food")
                : resource === "larvae" ? I18N.t("resource.larvae")
                : resource === "ants" ? I18N.t("tooltip.preview.ants")
                : I18N.t("tooltip.preview.queens");
            costLines.push({ cost: value, label, abbreviation: resourceNames[resource] });
        });

        const lines = [];
        if (productionLines.length)
        {
            lines.push({ text: `${I18N.t("tooltip.preview.expectedProduction")}${unit}`, heading: true });
            lines.push(...productionLines);
        }
        if (consumptionLines.length)
        {
            lines.push({ text: I18N.t("tooltip.preview.expectedConsumption"), heading: true });
            lines.push(...consumptionLines);
        }
        if (otherLines.length || costLines.length)
        {
            lines.push({ text: I18N.t("tooltip.preview.expectedCosts"), heading: true });
            lines.push(...otherLines);
            lines.push(...costLines);
        }
        timeLines.push({ text: `${I18N.t("tooltip.preview.expectedDuration")}: ${formatDuration(preview.seconds)}` });
        if (timeLines.length)
        {
            lines.push({ text: I18N.t("tooltip.preview.expectedTime"), heading: true });
            lines.push(...timeLines);
        }

        nodes.preview.textContent = "";
        lines.forEach(line =>
        {
            const row = document.createElement("div");
            row.className = line.heading ? "iae-card-preview-heading" : line.tone ? "iae-card-preview-" + line.tone : "";
            if (line.cost !== undefined)
            {
                // Kosten aufrunden und Ressourcen-Kürzel als goldene Abbreviation rendern.
                row.append(document.createTextNode(formatCostNumber(line.cost) + " "));
                const abbr = document.createElement("span");
                abbr.className = "abbr-gold";
                abbr.textContent = line.abbreviation;
                row.append(abbr);
            }
            else
            {
                if (line.abbreviation)
                {
                    row.append(document.createTextNode(line.text + " "));
                    const abbr = document.createElement("span");
                    abbr.className = "abbr-gold";
                    abbr.textContent = line.abbreviation;
                    row.append(abbr);
                    if (line.suffix) { row.append(document.createTextNode(line.suffix)); }
                }
                else
                {
                const suffixStart = line.text.lastIndexOf(" ");
            const suffix = suffixStart >= 0 ? line.text.slice(suffixStart + 1) : "";
            const abbreviation = line.tone && suffix.length === 3 && "FLAK".includes(suffix[0]) && suffix.slice(1) === "/s"
                ? [line.text.slice(0, suffixStart + 1), suffix[0], "/s"]
                : null;
            if (abbreviation)
                {
                    row.append(document.createTextNode(abbreviation[0]));
                    const abbr = document.createElement("span");
                    abbr.className = "abbr-gold";
                    abbr.textContent = abbreviation[1];
                    row.append(abbr, document.createTextNode(abbreviation[2]));
                }
                else
                {
                    row.textContent = line.text;
                }
                }
            }
            nodes.preview.appendChild(row);
        });
        nodes.preview.hidden = false;
        if (event) { positionPreview(nodes, event); }
        if (!nodes.previewMoveHandler)
        {
            nodes.previewMoveHandler = moveEvent => positionPreview(nodes, moveEvent);
            document.addEventListener("mousemove", nodes.previewMoveHandler, { passive: true });
        }
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

            orderedStats(entry.stats).forEach(stat =>
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

        if (entry.toggleAction)
        {
            nodes.toggleButton = create("button", "iae-card-action iae-card-toggle-action", card, { type: "button" });
            nodes.toggleButtonLabel = create("span", "iae-card-action-label", nodes.toggleButton);
            create("span", "iae-card-action-glyph", nodes.toggleButton, { "aria-hidden": "true" });
            nodes.toggleButton.addEventListener("click", () => entry.toggleAction.run());
            // Brut-Expertin: An/Aus-Schalter oberhalb des Ausbildungsbuttons platzieren.
            card.insertBefore(nodes.toggleButton, nodes.button);
        }
        if (entry.action && entry.action.preview)
        {
            nodes.button.dataset.previewQuantity = "1";
            nodes.button.addEventListener("mouseenter", event => showPreview(entry, nodes, 1, event));
            nodes.button.addEventListener("focus", () => showPreview(entry, nodes, 1));
            nodes.button.addEventListener("blur", () => hidePreview(nodes));
        }

        if (entry.action && typeof entry.action.batchOptions === "function" && typeof entry.action.batchRun === "function")
        {
            nodes.batch = create("div", "iae-card-batch-actions", card);
            nodes.batchButtons = {};
            [["10", 10], ["25", 25], ["MAX", "max"]].forEach(([label, amount]) =>
            {
                const button = create("button", "iae-card-action iae-card-batch-btn", nodes.batch, { type: "button" });
                const buttonLabel = create("span", "iae-card-action-label", button);
                buttonLabel.textContent = label;
                create("span", "iae-card-action-glyph", button, { "aria-hidden": "true" });
                button.addEventListener("click", () => entry.action.batchRun(amount));
                if (entry.action.preview)
                {
                    button.addEventListener("mouseenter", event => showPreview(entry, nodes, amount, event));
                    button.addEventListener("focus", () => showPreview(entry, nodes, amount));
                    button.addEventListener("blur", () => hidePreview(nodes));
                }
                nodes.batchButtons[label] = button;
            });
        }

        if (entry.action && entry.action.preview)
        {
            nodes.preview = create("div", "iae-card-preview", document.body, { role: "tooltip", "aria-live": "polite" });
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

        orderedStats(entry.stats).forEach((stat, index) =>
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
        const limitReached = state === "max" || state === "built" || (typeof entry.limitReached === "function" && entry.limitReached());
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

        if (nodes.toggleButton)
        {
            const toggleVisible = typeof entry.toggleAction.visible === "function"
                ? entry.toggleAction.visible()
                : true;
            nodes.toggleButton.hidden = !toggleVisible;
            if (toggleVisible)
            {
                setText(nodes.toggleButtonLabel, entry.toggleAction.label);
                nodes.toggleButton.disabled = false;
            }
        }

        setText(nodes.hint, status.hint || "");

        if (nodes.batchButtons)
        {
            const options = entry.action.batchOptions();
            const canUse = state !== "locked" && state !== "max" && state !== "built" && state !== "soon" && state !== "training";
            // Alle Mehrkauf-Buttons bleiben sichtbar; jede Menge ist nur aktiv,
            // wenn sie vollständig finanzierbar und verfügbar ist.
            // Bei erreichtem Einheiten-/Gebäudemaximum sind Mehrkauf-Optionen nicht mehr relevant.
            nodes.batch.hidden = limitReached;
            nodes.batchButtons["10"].hidden = limitReached;
            nodes.batchButtons["25"].hidden = limitReached;
            nodes.batchButtons.MAX.hidden = limitReached;
            nodes.batchButtons["10"].disabled = !canUse || !options.ten;
            nodes.batchButtons["25"].disabled = !canUse || !options.twentyFive;
            nodes.batchButtons.MAX.disabled = !canUse || options.max < 1;
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

    function setPreviewsEnabled(enabled)
    {
        previewsEnabled = Boolean(enabled);
        try { localStorage.setItem(PREVIEW_ENABLED_KEY, String(previewsEnabled)); } catch (_) {}
        if (!previewsEnabled) { mounted.forEach(({ nodes }) => hidePreview(nodes)); }
    }

    function arePreviewsEnabled() { return previewsEnabled; }

    return { register, mountAll, updateAll, setPreviewsEnabled, arePreviewsEnabled };
})();
