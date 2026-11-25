/* =========================
    Sammler (Definition)
    - produziert direkt 1 Nahrung/s
    - erhöht die GESAMTE Pilzfarmproduktion um 1 % (additiv, nicht multiplikativ)
    Alle Sammler besitzen dieselbe Effizienz; die Effizienz wirkt auf beide Fähigkeiten.
    Kein Maximum. Wohnraum: 1.

    Kosten: Jeder Sammler baut auf den Kosten des vorherigen auf; nach jeder
    Berechnung wird jede Ressource einzeln aufgerundet und der gerundete Wert
    ist die Grundlage der nächsten Berechnung.
========================= */

const collectorCostCache = { number: 1, cost: null };

function getCollectorStepPercent(number)
{
    const step = BALANCE.collector.costSteps.find(entry => number >= entry.from && number <= entry.to);
    return step ? step.percent : 0;
}

// Kosten des Sammlers mit der laufenden Nummer `number` (1-basiert). Ergebnis wird zwischengespeichert.
function getCollectorCostForNumber(numberValue)
{
    const number = Math.max(1, Math.floor(Big(numberValue).toNumber()));

    if (collectorCostCache.cost === null || collectorCostCache.number > number)
    {
        collectorCostCache.number = 1;
        collectorCostCache.cost = {
            ants: Big(BALANCE.collector.baseCost.ants),
            food: Big(BALANCE.collector.baseCost.food),
            larvae: Big(BALANCE.collector.baseCost.larvae)
        };
    }

    while (collectorCostCache.number < number)
    {
        collectorCostCache.number++;

        const factor = Big(1).add(Big(getCollectorStepPercent(collectorCostCache.number)).div(100));
        const previous = collectorCostCache.cost;
        const next = resource => previous[resource].mul(factor).roundTo(9).ceil();

        collectorCostCache.cost = { ants: next("ants"), food: next("food"), larvae: next("larvae") };
    }

    // Nur der erste Sammler kostet 1 Ameise. Die gespeicherte Kostenreihe
    // bleibt unverändert, damit Sammler 2 und alle folgenden ihre bisherigen
    // Kosten behalten.
    if (number === 1)
    {
        return { ...collectorCostCache.cost, ants: Big(1) };
    }

    return collectorCostCache.cost;
}

UnitRegistry.register({
    id: "collector",
    nameKey: "unit.collector.name",
    store: { kind: "resource", key: "collectors" },
    housing: 1,

    // Vereinbarter Überlebensverbrauch.
    consumption: [{ resource: "food", rate: BALANCE.upkeep["collector"], kind: "survival" }],
    production: [{ resource: "food", rate: BALANCE.collector.foodPerSecond }],
    abilities: [{ type: "structureBonus", structure: "mushroom-farm", perUnit: BALANCE.collector.bonusPerCollector }],
    refund: { food: BALANCE.refunds["collector"] },

    recruit: {
        getCost: () => getCollectorCostForNumber(GameState.resources.collectors.add(1)),
        announce: false
    }
});
