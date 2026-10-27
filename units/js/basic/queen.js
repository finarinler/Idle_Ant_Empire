/* =========================
    Königin
    Kosten-, Kauf- und Produktionslogik. Darstellung: unitCatalog.js
========================= */

/* ---------- Kosten ---------- */

function getCurrentQueenFoodCost()
{
    return Big(CORE_CONFIG.QUEEN_BASE_COST_FOOD).mul(
        Big(CORE_CONFIG.QUEEN_COST_SCALING_FOOD).pow(GameState.resources.queens)
    );
}

function getCurrentQueenAntCost()
{
    return Big(CORE_CONFIG.QUEEN_BASE_COST_ANTS).mul(
        Big(CORE_CONFIG.QUEEN_COST_SCALING_ANTS).pow(GameState.resources.queens)
    ).ceil();
}

/* ---------- Kauf ---------- */

function buyQueen()
{
    const foodCost = getCurrentQueenFoodCost();
    const antCost = getCurrentQueenAntCost();

    if (GameState.resources.food.lt(foodCost) || getTotalAnts().lt(antCost))
    {
        return;
    }

    GameState.resources.food = GameState.resources.food.sub(foodCost);
    spendAnts(antCost);
    GameState.resources.queens = GameState.resources.queens.add(1);

    updateResources();
    saveGame();
}

/* ---------- Produktion / Verbrauch (pro Sekunde) ---------- */

function getQueenLarvaeProduction()
{
    return GameState.resources.queens.mul(CORE_CONFIG.QUEEN_LARVAE_PRODUCTION);
}

function getQueenFoodConsumption()
{
    return GameState.resources.queens.mul(CORE_CONFIG.QUEEN_FOOD_CONSUMPTION);
}
