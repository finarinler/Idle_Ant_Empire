/* =========================
    Ameisen-Pool
    Gekaufte, gefundene und gezüchtete Ameisen zählen zusammen.
========================= */

function getTotalAnts()
{
    return GameState.resources.ants
        .add(GameState.resources.antsFound)
        .add(GameState.resources.bredAnts);
}

/**
 * Zieht Ameisen ab: erst gekaufte, dann gefundene, dann gezüchtete.
 * Prüft vorher, ob genug da sind. Gibt es nicht genug, wird NICHTS abgezogen
 * und false zurückgegeben (kein negativer Bestand, keine Teilabzüge).
 *
 * @param {BigNum|number} amount
 * @returns {boolean}
 */
function spendAnts(amount)
{
    const needed = Big(amount);

    if (needed.isNegative() || getTotalAnts().lt(needed))
    {
        return false;
    }

    const resources = GameState.resources;
    let remaining = needed;

    const fromBought = BigNum.min(resources.ants, remaining);
    resources.ants = resources.ants.sub(fromBought);
    remaining = remaining.sub(fromBought);

    const fromFound = BigNum.min(resources.antsFound, remaining);
    resources.antsFound = resources.antsFound.sub(fromFound);
    remaining = remaining.sub(fromFound);

    resources.bredAnts = resources.bredAnts.sub(remaining);

    return true;
}
