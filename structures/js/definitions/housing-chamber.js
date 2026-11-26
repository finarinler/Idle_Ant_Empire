/* =========================
    Wohnkammer (Definition)
    Start: 1 Wohnkammer mit 10 Wohnraum. Weitere Kammern kosten je +0,5 % mehr (Zinseszins).
    Dauerhaft (kein Abriss). Globale Upgrades gelten für alle Kammern; neue Kammern starten
    auf dem aktuellen Level. Upgrades benötigen Baumeister und dürfen Stufen überspringen:
    Kosten aller Stufen + 20 %, Zeiten aller Stufen ×2 (danach Baumeister-Reduktion).
    Kosten, Bauzeit, Upgradekosten und Wohnraum je Stufe: VORLÄUFIG (siehe BALANCE.provisional.housing).
========================= */

(() =>
{
    "use strict";

    const config = BALANCE.provisional.housing;

    // Wohnraum je Wohnkammer auf dem gegebenen Level
    function housingCapacity(level)
    {
        return BALANCE.housing.baseCapacityPerChamber + config.capacityBonusPerLevel * (Math.max(1, level) - 1);
    }

    // Kosten der nächsten Wohnkammer: Zinseszins auf die Kosten der vorherigen
    function getChamberCost()
    {
        const factor = Big(BALANCE.housing.costGrowth).pow(Math.max(0, GameState.structures.housingCount - 1));

        return { food: Big(config.baseCost.food).mul(factor) };
    }

    // Kosten und Zeit für ein Upgrade von der aktuellen Stufe auf targetLevel
    function getUpgradeInfo(targetLevel)
    {
        const from = GameState.structures.housingLevel;
        const to = Math.max(from + 1, Math.min(BALANCE.housing.maxLevel, targetLevel || from + 1));
        let food = 0;
        let seconds = 0;

        for (let level = from; level < to; level++)
        {
            food += config.upgradeFood[level - 1];
            seconds += BALANCE.housing.upgradeSeconds[level - 1];
        }

        if (to - from > 1)
        {
            food *= BALANCE.housing.skipCostSurcharge;
            seconds *= BALANCE.housing.skipTimeFactor;
        }

        return { cost: { food: Big(food) }, seconds };
    }

    StructureRegistry.register({
        id: "housing-chamber",
        nameKey: "structure.housing.name",
        store: { section: "structures", key: "housingCount" },
        housingCapacity,

        build: {
            requiresBuilder: BALANCE.provisional.requiresBuilder.housingBuild,
            getInfo: () => ({
                cost: getChamberCost(),
                seconds: BALANCE.getCountBasedSeconds(GameState.structures.housingCount + 1, BALANCE.provisional.structureBuildSecondsByCount)
            })
        },

        upgrade: {
            requiresBuilder: BALANCE.provisional.requiresBuilder.housingUpgrade,
            levelKey: "housingLevel",
            maxLevel: BALANCE.housing.maxLevel,
            getUnlockedLevel: () => BALANCE.housing.maxLevel,
            getInfo: getUpgradeInfo
        }
    });
})();
