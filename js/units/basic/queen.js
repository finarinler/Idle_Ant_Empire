/* =========================
    Königin
========================= */

const QUEEN_DOM = {
    total: null,
    bought: null,
    desc: null,
    costDisplay: null,
    buyButton: null
};

function initQueenDOM()
{
    QUEEN_DOM.total = getEl("queen-total");
    QUEEN_DOM.bought = getEl("queen-bought");
    QUEEN_DOM.desc = getEl("queen-desc");
    QUEEN_DOM.costDisplay = getEl("queen-cost-display");
    QUEEN_DOM.buyButton = getEl("buy-queen-btn");

    if (QUEEN_DOM.buyButton)
    {
        QUEEN_DOM.buyButton.onclick = buyQueen;
    }
}

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

/* ---------- UI ---------- */

function updateQueenUI()
{
    const resources = GameState.resources;
    const foodCost = getCurrentQueenFoodCost();
    const antCost = getCurrentQueenAntCost();

    if (QUEEN_DOM.total)
    {
        QUEEN_DOM.total.textContent = formatGameNumber(resources.queens);
    }

    if (QUEEN_DOM.bought)
    {
        QUEEN_DOM.bought.textContent = formatGameNumber(resources.queens);
    }

    I18N.setText(QUEEN_DOM.desc, "unit.queen.desc", {
        production: formatDecimal(CORE_CONFIG.QUEEN_LARVAE_PRODUCTION, 1),
        consumption: formatDecimal(CORE_CONFIG.QUEEN_FOOD_CONSUMPTION, 1)
    });

    renderCostLine(QUEEN_DOM.costDisplay, { ants: antCost, food: foodCost }, ["ants", "food"]);

    if (QUEEN_DOM.buyButton)
    {
        QUEEN_DOM.buyButton.disabled = resources.food.lt(foodCost) || getTotalAnts().lt(antCost);
    }
}

onDOMReady(initQueenDOM);
