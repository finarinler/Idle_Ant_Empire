/* =========================
    Gebäude: Baulogik
    Vorratskammer erhöht das Nahrungslimit, Brutkammer das Larvenlimit
    (siehe core/capacity.js). Darstellung: structureCatalog.js
========================= */

const FOOD_STORAGE_COST = { larvae: 50, ants: 100, queens: 10, food: 1000 };
const LARVAE_STORAGE_COST = { food: 3000, larvae: 150, ants: 150, queens: 10 };

// Reihenfolge der Kosten in der Anzeige
const STRUCTURE_COST_ORDER = ["larvae", "ants", "queens", "food"];

function buyStorage()
{
    if (GameState.structures.storageCount > 0 || !payCost(FOOD_STORAGE_COST))
    {
        return;
    }

    GameState.structures.storageCount = 1;
    GameState.structures.hasStorage = true;

    updateResources();
    saveGame();

    addLogEntry("status.storage.built", "success");
    updateStatus("status.storage.effect");
}

function buyNursery()
{
    if (GameState.structures.nurseryCount > 0 || !payCost(LARVAE_STORAGE_COST))
    {
        return;
    }

    GameState.structures.nurseryCount = 1;
    GameState.structures.hasNursery = true;

    updateResources();
    saveGame();

    addLogEntry("status.nursery.built", "success");
    updateStatus("status.nursery.effect");
}
