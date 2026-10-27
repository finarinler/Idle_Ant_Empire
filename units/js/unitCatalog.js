/* =========================================================
    Einheiten-Katalog
    Zentrale Definition aller Einheiten-Karten (Daten und Aktionen).
    Die Darstellung übernimmt der gemeinsame CardBuilder.
    Spiellogik: basic/*.js und elite/*.js
========================================================= */

(() =>
{
    "use strict";

    const SECOND = () => I18N.t("statistics.unit.second");
    const rate = (sign, value, decimals, abbr) => `${sign}${formatDecimal(value, decimals)} [[${abbr}]]/s`;

    const trainAction = (run) => ({
        label: { key: "button.train" },
        missingLabel: { key: "button.missingResources" },
        run
    });

    function eliteStatus(config, stateKey, cost)
    {
        return () =>
        {
            const count = GameState.eliteUnits[stateKey] || 0;

            if (!hasEliteRequirements())
            {
                return { state: "locked", hint: { key: "status.elite.requirements" } };
            }

            if (count >= config.maxCount)
            {
                return { state: "max", hint: { key: "status.elite.maxReached" } };
            }

            return { state: canAffordCost(cost()) ? "available" : "missing" };
        };
    }

    const eliteCount = (config, stateKey) => ({
        value: () => formatGameNumber(GameState.eliteUnits[stateKey] || 0),
        max: config.maxCount
    });

    /* ---------- Basis-Einheiten ---------- */

    CardBuilder.register("units-basic", [
        {
            id: "ant",
            icon: "♟",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.ant.name" },
            desc: { key: "unit.ant.desc" },
            count: { value: () => formatGameNumber(getTotalAnts()) },
            stats: [
                { label: { key: "card.stat.foodProduction" }, value: () => rate("+", CORE_CONFIG.ANT_FOOD_PRODUCTION, 0, "F"), tone: "positive" },
                { label: { key: "card.stat.foodConsumption" }, value: () => rate("−", CORE_CONFIG.ANT_FOOD_CONSUMPTION, 2, "F") },
                { label: { key: "card.stat.bought" }, value: () => formatGameNumber(GameState.resources.ants) }
            ],
            cost: () => ({
                values: { larvae: getCurrentAntLarvaeCost(), food: getCurrentAntFoodCost() },
                order: ["larvae", "food"]
            }),
            action: { label: { key: "unit.ant.buy" }, run: buyAnt },
            status: () =>
            {
                const resources = GameState.resources;
                const affordable = resources.larvae.gte(getCurrentAntLarvaeCost())
                    && resources.food.gte(getCurrentAntFoodCost());

                return { state: affordable ? "available" : "missing" };
            }
        },
        {
            id: "queen",
            icon: "♛",
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.queen.name" },
            desc: { key: "unit.queen.desc" },
            count: { value: () => formatGameNumber(GameState.resources.queens) },
            stats: [
                { label: { key: "card.stat.larvaeProduction" }, value: () => rate("+", CORE_CONFIG.QUEEN_LARVAE_PRODUCTION, 1, "L"), tone: "positive" },
                { label: { key: "card.stat.foodConsumption" }, value: () => rate("−", CORE_CONFIG.QUEEN_FOOD_CONSUMPTION, 1, "F") }
            ],
            cost: () => ({
                values: { ants: getCurrentQueenAntCost(), food: getCurrentQueenFoodCost() },
                order: ["ants", "food"]
            }),
            action: { label: { key: "unit.queen.buy" }, run: buyQueen },
            status: () =>
            {
                const affordable = GameState.resources.food.gte(getCurrentQueenFoodCost())
                    && getTotalAnts().gte(getCurrentQueenAntCost());

                return { state: affordable ? "available" : "missing" };
            }
        },
        {
            id: "scout",
            icon: "⚲",
            startsHidden: true,
            type: { key: "card.type.unitBasic" },
            name: { key: "unit.scout.name" },
            desc: { key: "unit.scout.desc" },
            count: { value: () => formatGameNumber(GameState.eliteUnits.scoutCount || 0), max: SCOUT_CONFIG.maxCount },
            stats: [
                { label: { key: "card.stat.recovery" }, value: () => `${CORE_CONFIG.SCOUT_REST_MS / 1000} ${SECOND()}` }
            ],
            cost: () => ({ values: SCOUT_CONFIG.cost }),
            action: trainAction(buyScout),
            status: () =>
            {
                if (!GameState.achievements.expeditionCommander)
                {
                    return {
                        state: "locked",
                        hint: { key: "status.scout.needAchievement", params: { achievement: { key: "achievement.expeditionCommander.title" } } }
                    };
                }

                if ((GameState.eliteUnits.scoutCount || 0) >= SCOUT_CONFIG.maxCount)
                {
                    return { state: "max", hint: { key: "status.scout.alreadyTrained" } };
                }

                return { state: canAffordCost(SCOUT_CONFIG.cost) ? "available" : "missing" };
            }
        }
    ]);

    /* ---------- Elite-Einheiten ---------- */

    CardBuilder.register("units-elite", [
        {
            id: "guardian",
            icon: "⛨",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.storageGuardian.name" },
            desc: { key: "unit.storageGuardian.desc" },
            count: eliteCount(STORAGE_GUARDIAN_CONFIG, "storageGuardianCount"),
            stats: [
                { label: { key: "card.stat.foodLimit" }, value: "×2", tone: "positive" },
                { label: { key: "card.stat.upkeep" }, value: () => rate("−", STORAGE_GUARDIAN_CONFIG.upkeep, 2, "F") }
            ],
            cost: () => ({ values: getStorageGuardianCost() }),
            action: trainAction(buyStorageGuardian),
            status: eliteStatus(STORAGE_GUARDIAN_CONFIG, "storageGuardianCount", getStorageGuardianCost)
        },
        {
            id: "nurse-matriarch",
            icon: "❦",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.grandNurse.name" },
            desc: { key: "unit.grandNurse.desc" },
            count: eliteCount(GRAND_NURSE_CONFIG, "grandNurseCount"),
            stats: [
                { label: { key: "card.stat.larvaeLimit" }, value: "×2", tone: "positive" },
                { label: { key: "card.stat.upkeep" }, value: () => rate("−", GRAND_NURSE_CONFIG.upkeep, 2, "F") }
            ],
            cost: () => ({ values: getGrandNurseCost() }),
            action: trainAction(buyGrandNurse),
            status: eliteStatus(GRAND_NURSE_CONFIG, "grandNurseCount", getGrandNurseCost)
        },
        {
            id: "brood-expert",
            icon: "✿",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.broodExpert.name" },
            desc: { key: "unit.broodExpert.desc" },
            count: eliteCount(BROOD_EXPERT_CONFIG, "broodExpertCount"),
            stats: [
                { label: { key: "card.stat.cycle" }, value: () => `${BROOD_EXPERT_CONFIG.productionInterval} ${SECOND()}` },
                { label: { key: "card.stat.yield" }, value: () => `+1 [[A]], −${BROOD_EXPERT_CONFIG.larvaePerUnit} [[L]]`, tone: "positive" }
            ],
            progressId: "brood-expert-progress",
            cost: () => ({ values: getBroodExpertCost() }),
            action: trainAction(buyBroodExpert),
            status: eliteStatus(BROOD_EXPERT_CONFIG, "broodExpertCount", getBroodExpertCost)
        },
        {
            id: "soldier",
            icon: "⚔",
            type: { key: "card.type.unitElite" },
            name: { key: "unit.soldier.name" },
            desc: { key: "unit.soldier.desc" },
            count: { value: () => formatGameNumber(GameState.eliteUnits.soldierCount || 0) },
            cost: "???",
            action: { label: { key: "button.locked" } },
            status: () => ({ state: "soon", hint: { key: "card.hint.soon" } })
        }
    ]);
})();
