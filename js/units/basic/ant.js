/* =========================
    Ameise
========================= */

const ANT_DOM = {
    total: null,
    bought: null,
    costDisplay: null,
    buyButton: null
};

function initAntDOM()
{
    ANT_DOM.total = getEl("ant-total");
    ANT_DOM.bought = getEl("ant-bought");
    ANT_DOM.costDisplay = getEl("ant-cost-display");
    ANT_DOM.buyButton = getEl("buy-ant-btn");

    if (ANT_DOM.buyButton)
    {
        ANT_DOM.buyButton.onclick = buyAnt;
    }
}

/* ---------- Kosten ---------- */

function getCurrentAntFoodCost()
{
    return CORE_CONFIG.ANT_BASE_COST_FOOD * Math.pow(
        CORE_CONFIG.ANT_COST_SCALING,
        GameState.resources.ants
    );
}

/* ---------- Kauf ---------- */

function buyAnt()
{
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = CORE_CONFIG.ANT_BASE_COST_LARVAE;

    if (GameState.resources.larvae >= larvaeCost && GameState.resources.food >= foodCost)
    {
        GameState.resources.larvae -= larvaeCost;
        GameState.resources.food -= foodCost;
        GameState.resources.ants += 1;
        
        updateResources();
        saveGame();
    }
}

/* ---------- Produktion / Verbrauch (pro Sekunde) ---------- */

function getAntFoodProduction()
{
    return getTotalAnts() * CORE_CONFIG.ANT_FOOD_PRODUCTION;
}

function getAntFoodConsumption()
{
    if (GameState.achievements.goldenAge)
    {
        return 0;
    }

    return getTotalAnts() * CORE_CONFIG.ANT_FOOD_CONSUMPTION;
}

/* ---------- UI ---------- */

function updateAntUI()
{
    const resources = GameState.resources;
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = CORE_CONFIG.ANT_BASE_COST_LARVAE;

    if (ANT_DOM.total)
    {
        ANT_DOM.total.textContent = formatGameNumber(getTotalAnts());
    }

    if (ANT_DOM.bought)
    {
        ANT_DOM.bought.textContent = formatGameNumber(resources.ants);
    }

    if (ANT_DOM.costDisplay)
    {
        ANT_DOM.costDisplay.textContent =
            `${formatGameNumber(larvaeCost)} L, ${formatGameNumber(foodCost)} F`;
    }

    if (ANT_DOM.buyButton)
    {
        ANT_DOM.buyButton.disabled = resources.larvae < larvaeCost || resources.food < foodCost;
    }
}

onDOMReady(initAntDOM);
