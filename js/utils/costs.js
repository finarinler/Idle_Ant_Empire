/* =========================
    Kosten-Helfer für Einheiten
    Kosten-Objekt: { ants, food, larvae, queens }
========================= */

/**
 * Basis-Kosten, die je Ressource mit multipliers[ressource]^count steigen.
 * baseCost / multipliers: { ants, food, larvae, queens }
 */
function getScaledCost(baseCost, multipliers, count)
{
    return {
        ants: Math.ceil(baseCost.ants * Math.pow(multipliers.ants, count)),
        food: Math.ceil(baseCost.food * Math.pow(multipliers.food, count)),
        larvae: Math.ceil(baseCost.larvae * Math.pow(multipliers.larvae, count)),
        queens: Math.ceil(baseCost.queens * Math.pow(multipliers.queens, count))
    };
}

function canAffordCost(cost)
{
    return getTotalAnts() >= (cost.ants || 0)
        && GameState.resources.food >= (cost.food || 0)
        && GameState.resources.larvae >= (cost.larvae || 0)
        && GameState.resources.queens >= (cost.queens || 0);
}

function payCost(cost)
{
    spendAnts(cost.ants || 0);
    GameState.resources.food -= (cost.food || 0);
    GameState.resources.larvae -= (cost.larvae || 0);
    GameState.resources.queens -= (cost.queens || 0);
}
