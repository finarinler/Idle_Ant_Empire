/* =========================
    Ameisen-Pool
    Gekaufte, gefundene und gezüchtete Ameisen zählen zusammen.
========================= */

function getTotalAnts()
{
    return GameState.resources.ants
        + GameState.resources.antsFound
        + GameState.resources.bredAnts;
}

/**
 * Zieht Ameisen ab: erst gekaufte, dann gefundene, dann gezüchtete.
 * Prüft vorher NICHT, ob genug da sind (canAfford vorher aufrufen).
 */
function spendAnts(amount)
{
    let remaining = amount;

    const fromBought = Math.min(GameState.resources.ants, remaining);
    GameState.resources.ants -= fromBought;
    remaining -= fromBought;

    const fromFound = Math.min(GameState.resources.antsFound, remaining);
    GameState.resources.antsFound -= fromFound;
    remaining -= fromFound;

    GameState.resources.bredAnts -= remaining;
}
