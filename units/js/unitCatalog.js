/* =================================================
    Einheiten-Katalog
    Zentrale Definition aller Einheiten-Karten (Daten und Aktionen).
    Die Darstellung übernimmt der gemeinsame CardBuilder.
    Konfiguration: units/js/definitions/*.js · Käufe: unitActions.js · Rechnung: core/economy
================================================= */

(() =>
{
    "use strict";

    const SECOND = () => I18N.t("statistics.unit.second");
    const rate = (sign, value, decimals, abbr) => `${sign}${formatDecimal(value, decimals)} [[${abbr}]]/s`;

    const totalProductionStat = (id, resource) => ({
        label: { key: "card.stat.totalProduction" },
        value: () =>
        {
            const total = Economy.computeFlows().unitProduced[id][resource].roundTo(1);
            const abbreviation = resource === "food" ? "F" : "L";
            return `${total.isPositive() ? "+" : ""}${formatRate(total)} [[${abbreviation}]]/s`;
        },
        tone: "positive"
    });

    const trainAction = (run, id) => ({
        label: { key: "button.train" },
        missingLabel: { key: "button.missingResources" },
        preview: { kind: "unit", id },
        batchOptions: () => Economy.getTrainingBatchOptions(id),
        queueProgress: () => {
            const progress = Economy.getTrainingQueueProgress(id);
            return progress ? { ...progress, key: "queue.progress.training" } : null;
        },
        batchRun: amount => recruitUnitBatch(id, amount),
        run
    });

    const statusOf = id => () =>
    {
        const state = Economy.getRecruitState(id);
        return { state: state.state, hint: state.hint };
    };

    const housingStat = id => ({
        label: { key: "card.stat.housing" },
        value: () => String(UnitRegistry.get(id).housing)
    });

    const trainingStat = id => ({
        label: { key: "card.stat.trainingTime" },
        value: () =>
        {
            const seconds = Economy.getTrainingSeconds(id);
            if (seconds < 60) { return `${seconds} ${SECOND()}`; }
            const minutes = Math.floor(seconds / 60);
            const remainder = seconds % 60;
            return remainder > 0
                ? `${minutes} ${I18N.t("statistics.unit.minute")} ${remainder} ${SECOND()}`
                : `${minutes} ${I18N.t("statistics.unit.minute")}`;
        }
    });

    const countOf = (id, max) => ({
        value: () => formatGameNumber(Economy.getUnitCount(id)),
        max
    });

    const survivalUpkeep = (id, decimals) => ({
        label: { key: "card.stat.upkeep" },
        value: () =>
        {
            const consumption = UnitRegistry.get(id).consumption[0].rate;
            const currentRate = typeof consumption === "function" ? consumption() : consumption;
            return rate("−", currentRate, decimals, "F");
        }
    });

    /* ---------- Basis-Einheiten ---------- */

    CardBuilder.register("units-basic", [
        {
            id: "ant",
            trainingProgressId: "training-normal-ant-progress",
            icon: "♟",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.ant.name" },
            desc: { key: "unit.ant.desc" },
            count: { value: () => formatGameNumber(getTotalAnts()) },
            stats: [
                { label: { key: "card.stat.foodProduction" }, value: () => rate("+", GameState.achievements.purchasedAnts1000 ? GameState.resources.ants.mul(0.1).toNumber() : 0, 1, "F"), tone: "positive" },
                totalProductionStat("normal-ant", "food"),
                {
                    label: { key: "card.stat.foodConsumption" },
                    value: () => GameState.achievements.goldenAge
                        ? rate("−", 0, 0, "F")
                        : rate("−", UnitRegistry.get("normal-ant").consumption[0].rate, 2, "F")
                },
                housingStat("normal-ant"),
                trainingStat("normal-ant")
            ],
            cost: () => ({ values: Economy.getRecruitCost("normal-ant"), order: ["larvae", "food"] }),
            action: trainAction(buyAnt, "normal-ant"),
            status: statusOf("normal-ant")
        },
        {
            id: "queen",
            trainingProgressId: "training-queen-progress",
            icon: "♛",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.queen.name" },
            desc: { key: "unit.queen.desc" },
            count: countOf("queen"),
            stats: [
                { label: { key: "card.stat.larvaeProduction" }, value: () => rate("+", BALANCE.larvaeProductionPerQueen, 1, "L"), tone: "positive" },
                totalProductionStat("queen", "larvae"),
                { label: { key: "card.stat.foodConsumption" }, value: () => rate("−", BALANCE.upkeep["queen"], 1, "F") },
                housingStat("queen"),
                trainingStat("queen")
            ],
            cost: () => ({ values: Economy.getRecruitCost("queen"), order: ["ants", "food"] }),
            action: trainAction(buyQueen, "queen"),
            status: statusOf("queen")
        },
        {
            id: "collector",
            trainingProgressId: "training-collector-progress",
            icon: "❖",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.collector.name" },
            desc: { key: "unit.collector.desc" },
            count: countOf("collector"),
            stats: [
                { label: { key: "card.stat.foodProduction" }, value: () => rate("+", BALANCE.collector.foodPerSecond, 0, "F"), tone: "positive" },
                totalProductionStat("collector", "food"),
                { label: { key: "card.stat.collectorFarmAchievementBonus" }, value: () => `+${formatDecimal(Economy.modifiers.getCollectorAchievementBonus() * 100, 1)} %`, tone: "positive" },
                housingStat("collector"),
                trainingStat("collector")
            ],
            cost: () => ({ values: Economy.getRecruitCost("collector"), order: ["ants", "food", "larvae"] }),
            action: trainAction(buyCollector, "collector"),
            status: statusOf("collector")
        },
        {
            id: "builder",
            trainingProgressId: "training-builder-progress",
            icon: "⚒",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.builder.name" },
            desc: { key: "unit.builder.desc" },
            count: countOf("builder", () => formatGameNumber(Economy.getUnitMaxCount(UnitRegistry.get("builder")))),
            stats: [
                { label: { key: "card.stat.buildSpeed" }, value: () => `−${formatDecimal(BALANCE.builder.reductionPerBuilder * 100, 0)} %`, tone: "positive" },
                { label: { key: "card.stat.buildTimeNow" }, value: () => `−${formatDecimal((1 - Economy.getBuildTimeFactor()) * 100, 0)} %`, tone: "positive" },
                survivalUpkeep("builder", 0),
                housingStat("builder"),
                trainingStat("builder")
            ],
            cost: () => ({ values: Economy.getRecruitCost("builder"), order: ["ants", "food", "larvae", "queens"] }),
            action: trainAction(buyBuilder, "builder"),
            status: statusOf("builder")
        }
    ]);

    CardBuilder.register("units-elite", [
{
            id: "scout",
            trainingProgressId: "training-scout-progress",
            icon: "⚲",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.scout.name" },
            desc: { key: "unit.scout.desc" },
            count: countOf("scout", 1),
            limitReached: () => hasScout(),
            stats: [
                { label: { key: "card.stat.recovery" }, value: () => `${CORE_CONFIG.SCOUT_REST_MS / 1000} ${SECOND()}` },
                survivalUpkeep("scout", 2),
                housingStat("scout"),
                {
                    label: { key: "card.stat.automation" },
                    value: () => hasScout()
                        ? { key: isScoutAutomationOn() ? "unit.scout.on" : "unit.scout.off" }
                        : "—"
                },
                trainingStat("scout")
            ],
            cost: () => ({ values: Economy.getRecruitCost("scout") }),
            action: {
                label: () => hasScout()
                    ? { key: isScoutAutomationOn() ? "unit.scout.switchOff" : "unit.scout.switchOn" }
                    : { key: "button.train" },
                missingLabel: { key: "button.missingResources" },
                keepLabel: true,
                preview: { kind: "unit", id: "scout" },
                batchOptions: () => hasScout() ? { ten: false, twentyFive: false, max: 0 } : Economy.getTrainingBatchOptions("scout"),
                queueProgress: () => {
                    const progress = Economy.getTrainingQueueProgress("scout");
                    return progress ? { ...progress, key: "queue.progress.training" } : null;
                },
                batchRun: amount => recruitUnitBatch("scout", amount),
                run: () => hasScout() ? toggleScoutAutomation() : buyScout()
            },
            status: () =>
            {
                if (hasScout()) { return { state: "available" }; }
                const state = Economy.getRecruitState("scout");
                return { state: state.state, hint: state.hint };
            }
        },

        {
            id: "guardian",
            trainingProgressId: "training-storage-keeper-progress",
            icon: "⛨",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.storageGuardian.name" },
            desc: { key: "unit.storageGuardian.desc" },
            count: countOf("storage-keeper", BALANCE.carriedOver.storageKeeper.maxCount),
            stats: [
                { label: { key: "card.stat.foodLimit" }, value: "×2", tone: "positive" },
                survivalUpkeep("storage-keeper", 0),
                trainingStat("storage-keeper")
            ],
            cost: () => ({ values: Economy.getRecruitCost("storage-keeper") }),
            action: trainAction(buyStorageGuardian, "storage-keeper"),
            status: statusOf("storage-keeper")
        },
        {
            id: "nurse-matriarch",
            trainingProgressId: "training-grand-nurse-progress",
            icon: "❦",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.grandNurse.name" },
            desc: { key: "unit.grandNurse.desc" },
            count: countOf("grand-nurse", BALANCE.carriedOver.grandNurse.maxCount),
            stats: [
                { label: { key: "card.stat.larvaeLimit" }, value: "×2", tone: "positive" },
                survivalUpkeep("grand-nurse", 0),
                trainingStat("grand-nurse")
            ],
            cost: () => ({ values: Economy.getRecruitCost("grand-nurse") }),
            action: trainAction(buyGrandNurse, "grand-nurse"),
            status: statusOf("grand-nurse")
        },
        {
            id: "brood-expert",
            trainingProgressId: "training-brood-expert-progress",
            icon: "✿",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.broodExpert.name" },
            desc: { key: "unit.broodExpert.desc" },
            count: countOf("brood-expert", BALANCE.carriedOver.broodExpert.maxCount),
            stats: [
                {
                    label: { key: "card.stat.hatchTime" },
                    value: () => `${UnitRegistry.get("brood-expert").hatch.getSeconds(Math.max(1, GameState.eliteUnits.broodExpertCount))} ${SECOND()}`
                },
                { label: { key: "card.stat.hatchCost" }, value: () => `${formatGameNumber(UnitRegistry.get("brood-expert").hatch.cost.larvae)} [[L]]` },
                survivalUpkeep("brood-expert", 0),
                {
                    label: { key: "card.stat.automation" },
                    value: () => ({ key: isBroodExpertOn() ? "unit.broodExpert.on" : "unit.broodExpert.off" })
                },
                housingStat("brood-expert"),
                trainingStat("brood-expert")
            ],
            progressId: "brood-expert-progress",
            cost: () => ({ values: Economy.getRecruitCost("brood-expert") }),
            action: {
                label: { key: "button.train" },
                missingLabel: { key: "button.missingResources" },
                preview: { kind: "unit", id: "brood-expert" },
                batchOptions: () => Economy.getTrainingBatchOptions("brood-expert"),
                queueProgress: () => {
                    const progress = Economy.getTrainingQueueProgress("brood-expert");
                    return progress ? { ...progress, key: "queue.progress.training" } : null;
                },
                batchRun: amount => recruitUnitBatch("brood-expert", amount),
                run: buyBroodExpert
            },
            toggleAction: {
                visible: () => Economy.getUnitNumber("brood-expert") > 0,
                label: () => ({ key: isBroodExpertOn() ? "unit.broodExpert.switchOff" : "unit.broodExpert.switchOn" }),
                run: toggleBroodExpert
            },
            status: statusOf("brood-expert")
        }
    ]);
})();
