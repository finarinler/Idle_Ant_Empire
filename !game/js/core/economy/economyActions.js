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
            const info = { key: "status.elite.maxReached" };
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
