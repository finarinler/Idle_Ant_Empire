
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

function getAntCostScaling(antNumber)
{
    if (antNumber <= 10)   return 1.15;   // 2–10: +15 %
    if (antNumber <= 25)   return 1.10;   // 11–25: +10 %
    if (antNumber <= 50)   return 1.075;  // 26–50: +7,5 %
    if (antNumber <= 100)  return 1.05;   // 51–100: +5 %
    if (antNumber <= 150)  return 1.03;   // 101–150: +3 %
    if (antNumber <= 200)  return 1.02;   // 151–200: +2 %
    if (antNumber <= 300)  return 1.01;   // 201–300: +1 %
    if (antNumber <= 500)  return 1.005;  // 301–500: +0,5 %
    if (antNumber <= 1000) return 1.002;  // 501–1000: +0,2 %
    if (antNumber <= 2000) return 1.001;  // 1001-2000: +0,1%
    if (antNumber <= 5000) return 1.0005; // 2001-5000: +0.05%
    if (antNumber <= 10000) return 1.00025; //5001-10000: +0,025%
    return 1.0001;                        // 10001+: +0,01 %
}

function getCurrentAntFoodCost()
{
    let cost = CORE_CONFIG.ANT_BASE_COST_FOOD;

    for (
        let antNumber = 2;
        antNumber <= GameState.resources.ants + 1;
        antNumber++
    )
    {
        cost *= getAntCostScaling(antNumber);
    }

    return cost;
}

/* ---------- Kauf ---------- */

function buyAnt()
{
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = CORE_CONFIG.ANT_BASE_COST_LARVAE;

    if (
        GameState.resources.larvae >= larvaeCost
        && GameState.resources.food >= foodCost
    )
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
        ANT_DOM.buyButton.disabled =
            resources.larvae < larvaeCost
            || resources.food < foodCost;
    }
}

onDOMReady(initAntDOM);
