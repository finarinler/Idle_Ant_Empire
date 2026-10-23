
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

/* ---------- Futterkosten ---------- */

function getAntCostScaling(antNumber)
{
    if (antNumber <= 10)    return 1.125;
    if (antNumber <= 20)    return 1.1125;
    if (antNumber <= 40)    return 1.10;
    if (antNumber <= 50)    return 1.075;
    if (antNumber <= 70)    return 1.05;
    if (antNumber <= 80)    return 1.025;
    if (antNumber <= 100)   return 1.0125;
    if (antNumber <= 250)   return 1.01;
    if (antNumber <= 300)   return 1.0075;
    if (antNumber <= 500)   return 1.005;
    if (antNumber <= 1000)  return 1.0025;
    if (antNumber <= 2500)  return 1.00125;
    if (antNumber <= 5000)  return 1.001;
    if (antNumber <= 7500)  return 1.00075;
    if (antNumber <= 10000) return 1.0001;

    return 1.00005;
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

/* ---------- Larvenkosten ---------- */

function getCurrentAntLarvaeCost()
{
    const antNumber = GameState.resources.ants + 1;

    if (antNumber <= 10)  return 1;
    if (antNumber <= 20)  return 2;
    if (antNumber <= 30)  return 3;
    if (antNumber <= 40)  return 4;
    if (antNumber <= 50)  return 5;
    if (antNumber <= 60)  return 6;
    if (antNumber <= 70)  return 7;
    if (antNumber <= 80)  return 8;
    if (antNumber <= 90)  return 9;
    if (antNumber <= 100) return 10;

    let cost = 10;

    for (let i = 101; i <= antNumber; i++)
    {
        if (i <= 200)
            cost *= 1.001;
        else if (i <= 500)
            cost *= 1.0005;
        else if (i <= 1000)
            cost *= 1.00025;
        else
            cost *= 1.0001;
    }

    return cost;
}

/* ---------- Kauf ---------- */

function buyAnt()
{
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = getCurrentAntLarvaeCost();

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
    const larvaeCost = getCurrentAntLarvaeCost();

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
