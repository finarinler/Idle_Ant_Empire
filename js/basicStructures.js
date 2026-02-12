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
}

function buyNursery()
{
    if (
        GameState.resources.food >= 3000 &&
        GameState.resources.larvae >= 150 &&
        GameState.resources.ants >= 150 &&
        GameState.resources.queens >= 10
    )
    {
        GameState.resources.food -= 3000;
        GameState.resources.larvae -= 150;
        GameState.resources.ants -= 150;
        GameState.resources.queens -= 10; 
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
}