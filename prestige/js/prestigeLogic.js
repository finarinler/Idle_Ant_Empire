/* =========================
   Prestige: EP-zu-PP-Berechnung
   Noch keine Prestige-Ausführung / kein Kolonie-Reset.
========================= */

(() =>
{
    "use strict";

    const BASE_EP_COST = 100;
    const EP_COST_INCREASE = 10;

    function getCumulativeCost(pointCount)
    {
        const count = Math.max(0, Math.floor(Number(pointCount) || 0));
        return BASE_EP_COST * count
            + EP_COST_INCREASE * count * (count - 1) / 2;
    }

    function calculatePointConversion(availableEP = GameState.stats.currentAchievementPoints)
    {
        const available = Math.max(0, Math.floor(Number(availableEP) || 0));
        let points = 0;
        let spentEP = 0;
        let nextCost = BASE_EP_COST;

        while (available - spentEP >= nextCost)
        {
            spentEP += nextCost;
            points += 1;
            nextCost = BASE_EP_COST + EP_COST_INCREASE * points;
        }

        return Object.freeze({
            availableEP: available,
            points,
            spentEP,
            remainingEP: available - spentEP,
            nextPointCost: nextCost,
            nextPointTotalEP: getCumulativeCost(points + 1)
        });
    }

    function getState()
    {
        const stats = GameState.stats;
        return Object.freeze({
            prestigeCount: Math.max(0, Math.floor(Number(stats.prestigeCount) || 0)),
            prestigePoints: Math.max(0, Math.floor(Number(stats.prestigePoints) || 0)),
            totalPrestigePointsEarned: Math.max(0, Math.floor(Number(stats.totalPrestigePointsEarned) || 0)),
            conversion: calculatePointConversion()
        });
    }

    window.PrestigeSystem = Object.freeze({
        BASE_EP_COST,
        EP_COST_INCREASE,
        getCumulativeCost,
        calculatePointConversion,
        getState
    });
})();
