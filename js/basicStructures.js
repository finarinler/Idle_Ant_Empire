/* =========================
    Structure Logic
========================= */

function buyStorage()
{
    if (
        GameState.resources.larvae >= 50 &&
        GameState.resources.ants >= 100 &&
        GameState.resources.queens >= 10 &&
        GameState.resources.food >= 1000
    )
    {
        GameState.resources.larvae -= 50;
        GameState.resources.ants -= 100;
        GameState.resources.queens -= 10;
        GameState.resources.food -= 1000;
        GameState.structures.storageCount = 1;
        GameState.structures.hasStorage = true;
        
        updateResources();
        saveGame();
        
        addLogEntry(
            "Vorratskammer gebaut!",
            "success"
        );
        updateStatus(
            "Maximale Nahrungskapazität deutlich erhöht!"
        );
    }
    else
    {
        updateStatus(
            "Nicht genügend Ressourcen für die Vorratskammer!",
            "error"
        );
    }
}

function buyNursery()
{
    if (GameState.structures.hasNursery)
    {
        return;
    }
    
    if (
        GameState.resources.food >= CORE_CONFIG.NURSERY_COST_FOOD &&
        GameState.resources.larvae >= CORE_CONFIG.NURSERY_COST_LARVAE &&
        GameState.resources.ants >= CORE_CONFIG.NURSERY_COST_ANTS
    )
    {
        GameState.resources.food -= CORE_CONFIG.NURSERY_COST_FOOD;
        GameState.resources.larvae -= CORE_CONFIG.NURSERY_COST_LARVAE;
        GameState.resources.ants -= CORE_CONFIG.NURSERY_COST_ANTS;
        
        GameState.structures.nurseryCount = 1;
        GameState.structures.hasNursery = true;
        
        updateResources();
        saveGame();
        
        addLogEntry(
            "Brutkammer gebaut!",
            "success"
        );
        updateStatus(
            "Maximale Larvenkapazität deutlich erhöht!"
        );
    }
    else
    {
        updateStatus(
            "Nicht genügend Ressourcen für die Brutkammer!",
            "error"
        );
    }
}