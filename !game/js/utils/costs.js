/* =========================
    Kosten-Helfer (reine Rechenfunktionen, keine Bestandsänderung)
    Kosten-Objekt: { ants, food, larvae, queens }
    (Werte als BigNum oder Zahl; fehlende Felder zählen als 0)
    Bezahlt wird ausschließlich über die zentrale Wirtschaft (Economy).
========================= */

/**
 * Basis-Kosten, die je Ressource mit multipliers[ressource]^count steigen.
 * Fehlende Ressourcen zählen als 0 bzw. Faktor 1. Ergebnis: aufgerundete BigNum-Werte.
 */
function getScaledCost(baseCost, multipliers, count)
{
    const scale = resource =>
    {
        const base = Big((baseCost && baseCost[resource]) || 0);
        const multiplier = multipliers && multipliers[resource] !== undefined ? multipliers[resource] : 1;

        return base.mul(Big(multiplier).pow(count)).ceil();
    };

    return {
        ants: scale("ants"),
        food: scale("food"),
        larvae: scale("larvae"),
        queens: scale("queens")
    };
}

/**
 * Basis-Kosten mal fester Faktor (z. B. Brutexpertin Nr. 3 = 1.000 %); jede Ressource aufgerundet.
 */
function getFactoredCost(baseCost, factor)
{
    const scale = resource => Big((baseCost && baseCost[resource]) || 0).mul(factor).ceil();

    return { ants: scale("ants"), food: scale("food"), larvae: scale("larvae"), queens: scale("queens") };
}

/**
 * Produkt einer stückweise konstanten Preissteigerung in geschlossener Form:
 * Für jeden Index i von firstIndex bis lastIndex wird mit dem Faktor des
 * Abschnitts multipliziert, in dem i liegt.
 *
 * @param {{from:number, to:number, factor:number}[]} segments  (to darf Infinity sein)
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
    return Big((cost && cost[resource]) || 0);
}

function canAffordCost(cost)
{
    return Economy.canAfford(cost);
}
