/* =========================
    Ant Logic
========================= */
function getCurrentAntFoodCost()
{
    return CORE_CONFIG.ANT_BASE_COST_FOOD * Math.pow(
        CORE_CONFIG.ANT_COST_SCALING,
        GameState.resources.ants
    );
}

function buyAnt()
{
    const foodCost = getCurrentAntFoodCost();
    const larvaeCost = CORE_CONFIG.ANT_BASE_COST_LARVAE;
    if (GameState.resources.larvae >= larvaeCost && GameState.resources.food >= foodCost)
    {
        GameState.resources.larvae -= larvaeCost;
        GameState.resources.food -= foodCost;
        GameState.resources.ants += 1;
        // Geändert: updateResources statt updateUI
        updateResources();
    }
}

/* =========================
    Queen Logic
========================= */
function getCurrentQueenFoodCost()
{
    return CORE_CONFIG.QUEEN_BASE_COST_FOOD * Math.pow(
        CORE_CONFIG.QUEEN_COST_SCALING_FOOD,
        GameState.resources.queens
    );
}

function getCurrentQueenAntCost()
{
    return CORE_CONFIG.QUEEN_BASE_COST_ANTS * Math.pow(
        CORE_CONFIG.QUEEN_COST_SCALING_ANTS,
        GameState.resources.queens
    );
}

function buyQueen()
{
    const foodCost = getCurrentQueenFoodCost();
    const antCost = getCurrentQueenAntCost();
    const totalAnts = GameState.resources.ants + GameState.resources.antsFound;
    if (GameState.resources.food >= foodCost && totalAnts >= antCost)
    {
        GameState.resources.food -= foodCost;
        if (GameState.resources.ants >= antCost)
        {
            GameState.resources.ants -= antCost;
        }
        else
        {
            const fromFound = antCost - GameState.resources.ants;
            GameState.resources.ants = 0;
            GameState.resources.antsFound -= fromFound;
        }
        GameState.resources.queens += 1;
        // Geändert: updateResources statt updateUI
        updateResources();
    }
}