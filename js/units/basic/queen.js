/* =========================
    Königin
========================= */

const QUEEN_DOM = {
    total: null,
    bought: null,
    costDisplay: null,
    buyButton: null
};

function initQueenDOM()
{
    QUEEN_DOM.total = getEl("queen-total");
    QUEEN_DOM.bought = getEl("queen-bought");
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
    return CORE_CONFIG.QUEEN_BASE_COST_FOOD * Math.pow(
        CORE_CONFIG.QUEEN_COST_SCALING_FOOD,
        GameState.resources.queens
    );
}

function getCurrentQueenAntCost()
{
    return Math.ceil(
        CORE_CONFIG.QUEEN_BASE_COST_ANTS * Math.pow(
            CORE_CONFIG.QUEEN_COST_SCALING_ANTS,
            GameState.resources.queens
        )
    );
}

/* ---------- Kauf ---------- */

function buyQueen()
{
    const foodCost = getCurrentQueenFoodCost();
    const antCost = getCurrentQueenAntCost();

    if (GameState.resources.food < foodCost || getTotalAnts() < antCost)
    {
        return;
    }

    GameState.resources.food -= foodCost;
    spendAnts(antCost);
    GameState.resources.queens += 1;

    updateResources();
    saveGame();
}

/* ---------- Produktion / Verbrauch (pro Sekunde) ---------- */

function getQueenLarvaeProduction()
{
    return GameState.resources.queens * CORE_CONFIG.QUEEN_LARVAE_PRODUCTION;
}

function getQueenFoodConsumption()
{
    return GameState.resources.queens * CORE_CONFIG.QUEEN_FOOD_CONSUMPTION;
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

    if (QUEEN_DOM.costDisplay)
    {
        QUEEN_DOM.costDisplay.textContent =
            `${formatGameNumber(antCost)} A, ${formatGameNumber(foodCost)} F`;
    }

    if (QUEEN_DOM.buyButton)
    {
        QUEEN_DOM.buyButton.disabled = resources.food < foodCost || getTotalAnts() < antCost;
    }
}

onDOMReady(initQueenDOM);
