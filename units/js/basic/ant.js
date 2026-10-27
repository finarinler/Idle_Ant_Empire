/* =========================
    Ameise
    Kosten-, Kauf- und Produktionslogik. Darstellung: unitCatalog.js
========================= */

/* ---------- Futterkosten ----------
   Der Preis der nächsten Ameise ist
       ANT_BASE_COST_FOOD * Produkt aller Faktoren factor(i) für i = 2 .. (gekaufte Ameisen + 1)
   Der Faktor hängt von der Ameisennummer i ab (Abschnitte unten). */

const ANT_FOOD_COST_SEGMENTS = [
    { from: 1,     to: 10,       factor: 1.125 },
    { from: 11,    to: 20,       factor: 1.1125 },
    { from: 21,    to: 40,       factor: 1.10 },
    { from: 41,    to: 50,       factor: 1.075 },
    { from: 51,    to: 70,       factor: 1.05 },
    { from: 71,    to: 80,       factor: 1.025 },
    { from: 81,    to: 100,      factor: 1.0125 },
    { from: 101,   to: 250,      factor: 1.01 },
    { from: 251,   to: 300,      factor: 1.0075 },
    { from: 301,   to: 500,      factor: 1.005 },
    { from: 501,   to: 1000,     factor: 1.0025 },
    { from: 1001,  to: 2500,     factor: 1.00125 },
    { from: 2501,  to: 5000,     factor: 1.001 },
    { from: 5001,  to: 7500,     factor: 1.00075 },
    { from: 7501,  to: 10000,    factor: 1.0001 },
    { from: 10001, to: Infinity, factor: 1.00005 }
];

function getCurrentAntFoodCost()
{
    const nextAntNumber = GameState.resources.ants.add(1);

    return Big(CORE_CONFIG.ANT_BASE_COST_FOOD)
        .mul(getSegmentedProduct(ANT_FOOD_COST_SEGMENTS, 2, nextAntNumber));
}

/* ---------- Larvenkosten ----------
   Ameise 1-100: 1 Larve pro 10 Ameisen (1, 2, ... 10).
   Ab Ameise 101: 10 * Produkt der Faktoren (Abschnitte unten). */

const ANT_LARVAE_COST_SEGMENTS = [
    { from: 101,  to: 200,      factor: 1.001 },
    { from: 201,  to: 500,      factor: 1.0005 },
    { from: 501,  to: 1000,     factor: 1.00025 },
    { from: 1001, to: Infinity, factor: 1.0001 }
];

function getCurrentAntLarvaeCost()
{
    const antNumber = GameState.resources.ants.add(1);

    if (antNumber.lte(100))
    {
        return Big(Math.ceil(antNumber.toNumber() / 10));
    }

    return Big(10).mul(getSegmentedProduct(ANT_LARVAE_COST_SEGMENTS, 101, antNumber));
}

/* ---------- Kauf ---------- */

function buyAnt()
{
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = getCurrentAntLarvaeCost();
    const resources = GameState.resources;

    if (resources.larvae.lt(larvaeCost) || resources.food.lt(foodCost))
    {
        return;
    }

    resources.larvae = resources.larvae.sub(larvaeCost);
    resources.food = resources.food.sub(foodCost);
    resources.ants = resources.ants.add(1);

    updateResources();
    saveGame();
}

/* ---------- Produktion / Verbrauch (pro Sekunde) ---------- */

function getAntFoodProduction()
{
    return getTotalAnts().mul(CORE_CONFIG.ANT_FOOD_PRODUCTION);
}

function getAntFoodConsumption()
{
    if (GameState.achievements.goldenAge)
    {
        return BigNum.ZERO;
    }

    return getTotalAnts().mul(CORE_CONFIG.ANT_FOOD_CONSUMPTION);
}
