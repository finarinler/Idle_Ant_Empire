/* =========================
    Production Logic
========================= */

function updateProduction()
{
    // Berechnungen basierend auf Ameisen und Königinnen
    const antFoodProd = (GameState.resources.ants + GameState.resources.antsFound) * CORE_CONFIG.ANT_FOOD_PRODUCTION;
    const antFoodCons = (GameState.resources.ants + GameState.resources.antsFound) * CORE_CONFIG.ANT_FOOD_CONSUMPTION;
    const queenLarvaeProd = GameState.resources.queens * CORE_CONFIG.QUEEN_LARVAE_PRODUCTION;
    const queenFoodCons = GameState.resources.queens * CORE_CONFIG.QUEEN_FOOD_CONSUMPTION;
    
    const totalCons = antFoodCons + queenFoodCons;

    // Nahrungsproduktion hinzufügen
    GameState.resources.food += antFoodProd;

    // Nahrungsverbrauch und Larvenproduktion
    if (GameState.resources.food >= totalCons)
    {
        GameState.resources.larvae += queenLarvaeProd;
        GameState.resources.food -= totalCons;
    }
    else
    {
        if (GameState.resources.food >= antFoodCons)
        {
            GameState.resources.food -= antFoodCons;
            if (GameState.resources.queens > 0)
            {
                updateStatus(
                    "Produktion gestoppt: Zu wenig Nahrung!",
                    "warning"
                );
            }
        }
        else
        {
            GameState.resources.food = 0;
            if (GameState.resources.ants > 0)
            {
                updateStatus(
                    "Kritischer Nahrungsmangel: Kolonie hungert!",
                    "warning"
                );
            }
        }
    }

    // Kapazitäts-Limits prüfen
    const currentFoodMax = GameState.structures.storageCount > 0 
        ? 10000 
        : CORE_CONFIG.FOOD_BASE_CAPACITY;
        
    const currentLarvaeMax = GameState.structures.nurseryCount > 0 
        ? 2500 
        : CORE_CONFIG.LARVAE_BASE_CAPACITY;

    if (GameState.resources.food > currentFoodMax) 
    {
        GameState.resources.food = currentFoodMax;
    }
    
    if (GameState.resources.larvae > currentLarvaeMax) 
    {
        GameState.resources.larvae = currentLarvaeMax;
    }
}