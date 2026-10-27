/* =========================
    Kosten-Helfer für Einheiten
    Kosten-Objekt: { ants, food, larvae, queens }
    (Werte als BigNum oder Zahl; fehlende Felder zählen als 0)
========================= */

/**
 * Basis-Kosten, die je Ressource mit multipliers[ressource]^count steigen.
 * baseCost / multipliers: { ants, food, larvae, queens }
 * Ergebnis: Kosten-Objekt aus aufgerundeten BigNum-Werten.
 */
function getScaledCost(baseCost, multipliers, count)
{
    const scale = resource => Big(baseCost[resource])
        .mul(Big(multipliers[resource]).pow(count))
        .ceil();

    return {
        ants: scale("ants"),
        food: scale("food"),
        larvae: scale("larvae"),
        queens: scale("queens")
    };
}

/**
 * Produkt einer stückweise konstanten Preissteigerung in geschlossener Form:
 * Für jeden Index i von firstIndex bis lastIndex wird mit dem Faktor des
 * Abschnitts multipliziert, in dem i liegt. Entspricht exakt einer Schleife
 * "cost *= factor(i)", funktioniert aber auch für riesige lastIndex-Werte.
 *
 * @param {{from:number, to:number, factor:number}[]} segments  (to darf Infinity sein)
 * @param {number} firstIndex
 * @param {BigNum|number} lastIndex
 * @returns {BigNum}
 */
function getSegmentedProduct(segments, firstIndex, lastIndex)
{
    const last = Big(lastIndex);
    let product = BigNum.ONE;

    for (const segment of segments)
    {
        const low = Math.max(segment.from, firstIndex);

        if (last.lt(low))
        {
            break;
        }

        const high = segment.to === Infinity ? last : BigNum.min(last, segment.to);
        const count = high.sub(low).add(1);

        if (count.lte(0))
        {
            continue;
        }

        product = product.mul(Big(segment.factor).pow(count));
    }

    return product;
}

function getCostAmount(cost, resource)
{
    return Big(cost[resource] || 0);
}

function canAffordCost(cost)
{
    return getTotalAnts().gte(getCostAmount(cost, "ants"))
        && GameState.resources.food.gte(getCostAmount(cost, "food"))
        && GameState.resources.larvae.gte(getCostAmount(cost, "larvae"))
        && GameState.resources.queens.gte(getCostAmount(cost, "queens"));
}

/**
 * Zieht die Kosten ab. Prüft vorher selbst, ob alles bezahlbar ist, und zieht
 * andernfalls nichts ab (atomar). Gibt zurück, ob bezahlt wurde.
 */
function payCost(cost)
{
    if (!canAffordCost(cost))
    {
        return false;
    }

    const resources = GameState.resources;

    spendAnts(getCostAmount(cost, "ants"));
    resources.food = resources.food.sub(getCostAmount(cost, "food"));
    resources.larvae = resources.larvae.sub(getCostAmount(cost, "larvae"));
    resources.queens = resources.queens.sub(getCostAmount(cost, "queens"));

    return true;
}
