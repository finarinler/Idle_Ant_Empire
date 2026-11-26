/* =========================================================
    Zentrale Wirtschaft – Aktionen
    Käufe, Rekrutierungen, Bauprojekte, Gutschriften.
    Einmalige Aktionskosten müssen VOLLSTÄNDIG verfügbar sein und werden beim
    Start vollständig abgezogen (atomar, nie negativ, nie teilweise).
    Prüfungen verwenden immer den tatsächlichen internen Bestand.
========================================================= */

(function ()
{
    "use strict";

    const COST_KEYS = ["ants", "food", "larvae", "queens"];

    /* ---------- Kosten ---------- */

    function amountOf(cost, key)
    {
        return Big((cost && cost[key]) || 0);
    }

    Economy.canAfford = function (cost)
    {
        const resources = GameState.resources;

        return getTotalAnts().gte(amountOf(cost, "ants"))
            && resources.food.gte(amountOf(cost, "food"))
            && resources.larvae.gte(amountOf(cost, "larvae"))
            && resources.queens.gte(amountOf(cost, "queens"));
    };

    // Intern (nur Wirtschaft): Kosten abziehen. Gibt false zurück und ändert NICHTS, wenn nicht bezahlbar.
    Economy._spend = function (cost)
    {
        if (!Economy.canAfford(cost))
        {
            return false;
        }

        const resources = GameState.resources;

        Economy._removeAnts(amountOf(cost, "ants"));
        resources.food = resources.food.sub(amountOf(cost, "food"));
        resources.larvae = resources.larvae.sub(amountOf(cost, "larvae"));
        resources.queens = resources.queens.sub(amountOf(cost, "queens"));

        return true;
    };

    // Intern: Ressource einlagern. Liegt der Bestand an/über der Kapazität, verfällt alles.
    Economy._store = function (resource, amount)
    {
        const add = Big(amount);

        if (!add.isPositive()) { return BigNum.ZERO; }

        const capacity = Economy.computeFlows().capacity[resource];
        const stock = GameState.resources[resource];

        if (stock.gte(capacity)) { return BigNum.ZERO; }

        const next = BigNum.min(capacity, stock.add(add));
        GameState.resources[resource] = next;

        return next.sub(stock);
    };

    // Gutschrift (z. B. Expeditionsfund) unter Beachtung der Lagergrenzen
    Economy.grant = function (resource, amount)
    {
        Economy.update();
        return Economy._store(resource, amount);
    };

    // Von Expeditionen gefundene Ameisen werden weiterhin direkt hinzugefügt (vorläufige Regel:
    // eine Überschreitung des Wohnraums ist dadurch möglich).
    Economy.addFoundAnt = function (amount = 1)
    {
        Economy.update();
        GameState.resources.antsFound = GameState.resources.antsFound.add(amount);
    };

    /* ---------- Vorschau für Bau- und Ausbildungsaktionen ---------- */

    Economy.getActionPreview = function (kind, id, quantity = 1)
    {
        const amount = Math.max(1, Math.min(1000, Math.floor(Number(quantity) || 1)));
        const costs = { ants: Big(0), food: Big(0), larvae: Big(0), queens: Big(0) };
        const before = Economy.computeFlows();
        let seconds = 0;
        let factor = amount >= 26 ? 0.80 : amount >= 25 ? 0.85 : amount >= 10 ? 0.90 : 1;
        let completed = 0;

        if (kind === "unit")
        {
            const def = UnitRegistry.get(id);
            try
            {
                for (; completed < amount; completed++)
                {
                    const cost = Economy.getRecruitCost(id);
                    COST_KEYS.forEach(key => { costs[key] = costs[key].add(amountOf(cost, key)); });
                    seconds += Economy.getTrainingSeconds(id) * factor;
                    Economy._addUnits(id, 1);
                }
            }
            finally
            {
                if (completed) { Economy._removeUnits(id, completed); }
            }
        }
        else
        {
            const def = StructureRegistry.get(id), store = def.store;
            try
            {
                for (; completed < amount; completed++)
                {
                    const info = Economy.getProjectInfo(id, "build");
                    COST_KEYS.forEach(key => { costs[key] = costs[key].add(amountOf(info.cost, key)); });
                    seconds += info.seconds * factor;
                    GameState[store.section][store.key]++;
                }
            }
            finally
            {
                GameState[store.section][store.key] -= completed;
            }
        }

        const after = Economy.computeFlows();
        return {
            quantity: completed,
            costs,
            seconds,
            factor,
            produced: Object.fromEntries(RESOURCE_IDS.map(key => [key, after.produced[key].sub(before.produced[key])])),
            consumed: Object.fromEntries(RESOURCE_IDS.map(key => [key, after.consumed[key].sub(before.consumed[key])])),
            capacity: Object.fromEntries(RESOURCE_IDS.map(key => [key, after.capacity[key].sub(before.capacity[key])]))
        };
    };

    /* ---------- Rekrutierung ---------- */

    Economy.getUnitMaxCount = function (def)
    {
        let max = typeof def.maxCount === "function" ? def.maxCount() : def.maxCount;

        if (max === undefined || max === null) { max = Infinity; }

        return max;
    };

    Economy.getUnitUnlockedCount = function (def)
    {
        const unlocked = typeof def.unlockedCount === "function" ? def.unlockedCount() : Infinity;
        return Math.min(Economy.getUnitMaxCount(def), unlocked);
    };

    Economy.getRecruitCost = function (id)
    {
        return UnitRegistry.get(id).recruit.getCost();
    };

    // Ausbildungszeit abhängig von der Nummer des neu ausgebildeten Sammlers.
    Economy.getTrainingSeconds = function (id)
    {
        if (id === "collector")
        {
            const nextCollector = Economy.getUnitNumber(id) + 1;
            return BALANCE.getCountBasedSeconds(nextCollector, BALANCE.collector.trainingSecondsByCount);
        }

        return BALANCE.trainingSeconds[id];
    };

    // { state: available | missing | locked | max, hint, reason }
    //   hint   = Text für die Karte,   reason = Text für die Fehlermeldung
    Economy.getRecruitState = function (id)
    {
        const def = UnitRegistry.get(id);
        const blocked = def.requirement ? def.requirement() : null;

        if (blocked)
        {
            return { state: "locked", hint: blocked.key ? blocked : undefined, reason: blocked };
        }

        if (GameState.economy.trainings && GameState.economy.trainings[id])
        {
            return { state: "training", hint: { key: "status.unit.trainingInProgress" } };
        }

        const count = Economy.getUnitCount(id);

        if (count.gte(Economy.getUnitMaxCount(def)))
        {
            const info = { key: id === "builder" ? "status.basic.maxReached" : "status.elite.maxReached" };
            return { state: "max", hint: info, reason: info };
        }

        if (count.gte(Economy.getUnitUnlockedCount(def)))
        {
            const info = { key: "status.requires.research" };
            return { state: "locked", hint: info, reason: info };
        }

        if (def.housing > 0 && Economy.getHousingFree().lt(def.housing))
        {
            const info = { key: "status.housing.full" };
            return { state: "missing", hint: info, reason: info };
        }

        if (!Economy.canAfford(def.recruit.getCost()))
        {
            return { state: "missing", reason: { key: "status.elite.cannotAfford" } };
        }

        return { state: "available" };
    };

    Economy.getTrainingBatchOptions = function (id)
    {
        const def = UnitRegistry.get(id);
        const current = Economy.getUnitCount(id).toNumber();
        const queue = GameState.economy.trainingQueues[id] || [];
        const pending = (GameState.economy.trainings[id] ? 1 : 0)
            + queue.reduce((sum, job) => sum + (Number(job.count) || 0), 0);
        const max = Economy.getUnitMaxCount(def);
        const unlocked = Economy.getUnitUnlockedCount(def);
        const limit = Math.max(0, Math.min(1000, Math.floor(max - current - pending), Math.floor(unlocked - current - pending)));
        if (limit < 1) { return { ten: false, twentyFive: false, max: 0 }; }

        // Dynamische Preise (z. B. Ameisen und Sammler) für jede geplante Einheit
        // einzeln berechnen, ohne Ressourcen tatsächlich auszugeben.
        const stock = {
            ants: getTotalAnts(),
            food: GameState.resources.food,
            larvae: GameState.resources.larvae,
            queens: GameState.resources.queens
        };
        let affordable = 0;
        try
        {
            for (; affordable < limit; affordable++)
            {
                const cost = Economy.getRecruitCost(id);
                let canPay = true;
                for (const key of COST_KEYS)
                {
                    if (stock[key].lt(amountOf(cost, key))) { canPay = false; break; }
                }
                if (!canPay) { break; }
                COST_KEYS.forEach(key => { stock[key] = stock[key].sub(amountOf(cost, key)); });
                Economy._addUnits(id, 1);
            }
        }
        finally
        {
            if (affordable > 0) { Economy._removeUnits(id, affordable); }
        }

        return { ten: affordable >= 10, twentyFive: affordable >= 25, max: affordable };
    };

    Economy.recruitBatch = function (id, amount, factorOverride)
    {
        Economy.update();
        const quantity = Math.floor(Number(amount));
        const factor = Number.isFinite(factorOverride) ? factorOverride : quantity >= 25 ? 0.85 : quantity >= 10 ? 0.90 : 1;
        if (!Number.isFinite(quantity) || quantity < 1 || quantity > 1000 || factor <= 0 || factor > 1 || (factor <= 0.80 && quantity < 26)) { return { ok: false, reason: { key: "status.elite.cannotAfford" } }; }
        const options = Economy.getTrainingBatchOptions(id);
        if (quantity > options.max) { return { ok: false, reason: { key: "status.elite.cannotAfford" } }; }
        const queue = GameState.economy.trainingQueues[id] || [];
        const last = queue[queue.length - 1];
        if (last && last.factor === factor) { last.count += quantity; }
        else { queue.push({ count: quantity, factor }); }
        GameState.economy.trainingQueues[id] = queue;
        Economy._startQueuedTraining(id);
        return { ok: true, queued: quantity };
    };

    Economy._startQueuedTraining = function (id)
    {
        const eco = GameState.economy;
        if (eco.trainings[id]) { return false; }
        const queue = eco.trainingQueues[id];
        if (!queue || !queue.length) { delete eco.trainingQueues[id]; return false; }
        const job = queue[0];
        const state = Economy.getRecruitState(id);
        if (state.state !== "available") { return false; }
        const duration = Economy.getTrainingSeconds(id) * job.factor;
        if (!Number.isFinite(duration) || duration <= 0 || !Economy._spend(Economy.getRecruitCost(id))) { return false; }
        eco.trainings[id] = { duration, remaining: duration, batchFactor: job.factor };
        job.count--;
        if (job.count <= 0) { queue.shift(); }
        if (!queue.length) { delete eco.trainingQueues[id]; }
        if (id === "normal-ant") { GameState.stats.totalPurchasedAnts = (GameState.stats.totalPurchasedAnts || 0) + 1; }
        return true;
    };

    Economy.recruit = function (id)
    {
        Economy.update();

        const state = Economy.getRecruitState(id);

        if (state.state !== "available")
        {
            return { ok: false, reason: state.reason };
        }

        const duration = Economy.getTrainingSeconds(id);

        if (!Number.isFinite(duration) || duration <= 0)
        {
            return { ok: false, reason: { key: "status.elite.cannotAfford" } };
        }

        if (!Economy._spend(Economy.getRecruitCost(id)))
        {
            return { ok: false, reason: { key: "status.elite.cannotAfford" } };
        }

        GameState.economy.trainings[id] = { duration, remaining: duration };

        // Nur tatsächlich bezahlte Käufe normaler Ameisen zählen – unabhängig davon,
        // wann die Ausbildung endet oder ob die Ameise später stirbt.
        if (id === "normal-ant")
        {
            GameState.stats.totalPurchasedAnts = (GameState.stats.totalPurchasedAnts || 0) + 1;
        }

        return { ok: true, durationSeconds: duration };
    };

    Economy.getTrainingProgress = function (id)
    {
        const training = GameState.economy.trainings && GameState.economy.trainings[id];
        if (!training || training.duration <= 0) { return 0; }
        return Math.max(0, Math.min(1, 1 - training.remaining / training.duration));
    };

    /* ---------- Schlupf (Anzeige) ---------- */

    Economy.getHatchProgress = function ()
    {
        const hatch = GameState.economy.hatch;

        if (!hatch.active || hatch.duration <= 0) { return 0; }

        return Math.max(0, Math.min(1, 1 - hatch.remaining / hatch.duration));
    };

    /* ---------- Bauprojekte ---------- */

    Economy.getBuildTimeFactor = function ()
    {
        const builders = Math.min(Economy.getUnitNumber("builder"), BALANCE.builder.maxBuilders);
        return 1 - BALANCE.builder.reductionPerBuilder * builders;
    };

    function getOperation(def, kind)
    {
        return kind === "upgrade" ? def.upgrade : def.build;
    }

    // { cost, baseSeconds, seconds, requiresBuilder }
    Economy.getProjectInfo = function (structureId, kind, targetLevel)
    {
        const def = StructureRegistry.get(structureId);
        const operation = getOperation(def, kind);
        const info = kind === "upgrade"
            ? operation.getInfo(targetLevel)
            : operation.getInfo();

        let requiresBuilder = Boolean(operation.requiresBuilder);

        // Ab der 16. Wohnkammer bzw. der 26. Pilzfarm wird ein Baumeister benötigt.
        // Die Nummer bezieht sich auf das als Nächstes gestartete Bauprojekt.
        if (kind === "build" && structureId === "housing-chamber")
        {
            requiresBuilder = requiresBuilder || Economy.getStructureNumber(structureId) + 1 >= 16;
        }
        else if (kind === "build" && structureId === "mushroom-farm")
        {
            requiresBuilder = requiresBuilder || Economy.getStructureNumber(structureId) + 1 >= 26;
        }

        return {
            cost: info.cost,
            baseSeconds: info.seconds,
            seconds: info.seconds * Economy.getBuildTimeFactor(),
            requiresBuilder
        };
    };

    function findProject(structureId, kind)
    {
        return ["free", "builder"]
            .map(slot => GameState.construction[slot])
            .find(project => project && project.structureId === structureId && project.kind === kind) || null;
    }

    Economy.getProject = findProject;

    Economy.getProjectProgress = function (structureId, kind)
    {
        const project = findProject(structureId, kind || "build");

        if (!project || project.duration <= 0) { return 0; }

        return Math.max(0, Math.min(1, 1 - project.remaining / project.duration));
    };

    // { state: available | missing | locked | max | built, hint, reason }
    Economy.getProjectState = function (structureId, kind, targetLevel)
    {
        const def = StructureRegistry.get(structureId);
        const operation = getOperation(def, kind);

        if (!operation) { return { state: "soon" }; }

        const blocked = def.requirement ? def.requirement() : null;

        if (blocked)
        {
            return { state: "locked", hint: blocked.key ? blocked : undefined, reason: blocked };
        }

        if (kind === "build")
        {
            const maxCount = def.maxCount === undefined ? Infinity : def.maxCount;

            if (findProject(structureId, "build"))
            {
                return { state: "missing", hint: { key: "status.build.inProgress" }, reason: { key: "status.build.inProgress" } };
            }

            if (Economy.getStructureNumber(structureId) >= maxCount)
            {
                return { state: "built" };
            }
        }
        else
        {
            if (structureId === "housing-chamber" && kind === "upgrade" && !GameState.achievements.knowledgeIsPower) { const info = { key: "status.requires.research" }; return { state: "locked", hint: info, reason: info }; }
            const level = GameState.structures[operation.levelKey];

            if (level >= operation.maxLevel) { return { state: "max", hint: { key: "status.elite.maxReached" } }; }

            if (targetLevel > operation.getUnlockedLevel())
            {
                const info = { key: "status.requires.research" };
                return { state: "locked", hint: info, reason: info };
            }

            if (findProject(structureId, "upgrade"))
            {
                return { state: "missing", hint: { key: "status.build.inProgress" }, reason: { key: "status.build.inProgress" } };
            }
        }

        const info = Economy.getProjectInfo(structureId, kind, targetLevel);
        const slot = info.requiresBuilder ? "builder" : "free";

        if (GameState.construction[slot])
        {
            const message = { key: "status.build.slotBusy" };
            return { state: "missing", hint: message, reason: message };
        }

        if (info.requiresBuilder && Economy.getUnitNumber("builder") < 1)
        {
            const message = { key: "status.build.needBuilder" };
            return { state: "missing", hint: message, reason: message };
        }

        if (!Economy.canAfford(info.cost))
        {
            return { state: "missing", reason: { key: "status.elite.cannotAfford" } };
        }

        return { state: "available" };
    };

    Economy.getProjectBatchOptions = function (id)
    {
        const def = StructureRegistry.get(id), store = def.store;
        if (!def.build) { return { ten: false, twentyFive: false, max: 0 }; }
        const current = Economy.getStructureNumber(id), queue = (GameState.construction.queues || {})[id] || [];
        const active = ["free", "builder"].filter(slot => GameState.construction[slot] && GameState.construction[slot].structureId === id && GameState.construction[slot].kind === "build").length;
        const pending = active + queue.reduce((n, job) => n + (Number(job.count) || 0), 0);
        const limit = Math.max(0, Math.min(1000, Math.floor((def.maxCount === undefined ? Infinity : def.maxCount) - current - pending)));
        const stock = { ants: getTotalAnts(), food: GameState.resources.food, larvae: GameState.resources.larvae, queens: GameState.resources.queens };
        let affordable = 0;
        // Aktive und bereits vorgemerkte Bauaufträge bei dynamischen Folgekosten berücksichtigen.
        GameState[store.section][store.key] += pending;
        try {
            for (; affordable < limit; affordable++) {
                const cost = Economy.getProjectInfo(id, "build").cost;
                if (COST_KEYS.some(key => stock[key].lt(amountOf(cost, key)))) { break; }
                COST_KEYS.forEach(key => { stock[key] = stock[key].sub(amountOf(cost, key)); });
                GameState[store.section][store.key]++;
            }
        } finally { GameState[store.section][store.key] -= pending + affordable; }
        return { ten: affordable >= 10, twentyFive: affordable >= 25, max: affordable };
    };

    Economy.queueProjectBatch = function (id, amount)
    {
        Economy.update();
        const quantity = Math.floor(Number(amount)), factor = quantity >= 26 ? 0.80 : quantity >= 25 ? 0.85 : quantity >= 10 ? 0.90 : 1;
        if (!Number.isFinite(quantity) || quantity < 1 || quantity > 1000 || (factor === 0.80 && quantity < 26)) return { ok: false, reason: { key: "status.elite.cannotAfford" } };
        const options = Economy.getProjectBatchOptions(id);
        if (quantity > options.max) return { ok: false, reason: { key: "status.elite.cannotAfford" } };
        GameState.construction.queues = GameState.construction.queues || {};
        const queue = GameState.construction.queues[id] || [], last = queue[queue.length - 1];
        if (last && last.factor === factor) last.count += quantity; else queue.push({ count: quantity, factor });
        GameState.construction.queues[id] = queue;
        Economy._startQueuedProject(id);
        return { ok: true, queued: quantity };
    };

    Economy._startQueuedProject = function (id)
    {
        const queues = GameState.construction.queues || {}, queue = queues[id];
        if (!queue || !queue.length) { delete queues[id]; return false; }
        if (["free", "builder"].some(slot => GameState.construction[slot] && GameState.construction[slot].structureId === id && GameState.construction[slot].kind === "build")) return false;
        const def = StructureRegistry.get(id);
        if ((def.requirement && def.requirement()) || Economy.getStructureNumber(id) >= (def.maxCount === undefined ? Infinity : def.maxCount)) return false;
        const job = queue[0], info = Economy.getProjectInfo(id, "build"), slot = info.requiresBuilder ? "builder" : "free";
        if (GameState.construction[slot] || (info.requiresBuilder && Economy.getUnitNumber("builder") < 1) || !Economy._spend(info.cost)) return false;
        const duration = info.seconds * job.factor;
        GameState.construction[slot] = { structureId: id, kind: "build", targetLevel: 0, duration, remaining: duration, batchFactor: job.factor };
        if (--job.count <= 0) queue.shift();
        if (!queue.length) delete queues[id];
        return true;
    };

    Economy.startProject = function (structureId, kind, targetLevel)
    {
        Economy.update();

        const state = Economy.getProjectState(structureId, kind, targetLevel);

        if (state.state !== "available")
        {
            return { ok: false, reason: state.reason };
        }

        const info = Economy.getProjectInfo(structureId, kind, targetLevel);

        if (!Economy._spend(info.cost))
        {
            return { ok: false, reason: { key: "status.elite.cannotAfford" } };
        }

        // Baugeschwindigkeit wird beim Start festgeschrieben
        GameState.construction[info.requiresBuilder ? "builder" : "free"] = {
            structureId,
            kind,
            targetLevel: kind === "upgrade" ? targetLevel : 0,
            duration: info.seconds,
            remaining: info.seconds
        };

        return { ok: true, durationSeconds: info.seconds };
    };

    // Intern: Abschluss eines Projekts
    Economy._applyProject = function (project)
    {
        const def = StructureRegistry.get(project.structureId);

        if (project.kind === "upgrade")
        {
            GameState.structures[def.upgrade.levelKey] = project.targetLevel;
            return;
        }

        const store = def.store;
        GameState[store.section][store.key] = (GameState[store.section][store.key] || 0) + 1;

        if (def.flagKey)
        {
            GameState.structures[def.flagKey] = true;
        }
    };
})();
