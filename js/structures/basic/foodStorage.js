/* =========================
    Vorratskammer
    Erhöht das Nahrungslimit (siehe core/capacity.js)
========================= */

const FOOD_STORAGE_COST = {
    larvae: 50,
    ants: 100,      // nur gekaufte Ameisen (wie bisher)
    queens: 10,
    food: 1000
};

const FOOD_STORAGE_DOM = {
    card: null,
    buyButton: null
};

function initFoodStorageDOM()
{
    FOOD_STORAGE_DOM.card = getEl("card-storage");
    FOOD_STORAGE_DOM.buyButton = getEl("buy-storage-btn");

    if (FOOD_STORAGE_DOM.buyButton)
    {
        FOOD_STORAGE_DOM.buyButton.onclick = buyStorage;
    }
}

function canAffordFoodStorage()
{
    return GameState.resources.larvae >= FOOD_STORAGE_COST.larvae
        && getTotalAntPool() >= FOOD_STORAGE_COST.ants
        && GameState.resources.queens >= FOOD_STORAGE_COST.queens
        && GameState.resources.food >= FOOD_STORAGE_COST.food;
}

/* ---------- Bau ---------- */

function buyStorage()
{
    if (GameState.structures.storageCount > 0 || !canAffordFoodStorage())
    {
        return;
    }

    GameState.resources.larvae -= FOOD_STORAGE_COST.larvae;
    getTotalAntPool() >= FOOD_STORAGE_COST.ants;
    GameState.resources.queens -= FOOD_STORAGE_COST.queens;
    GameState.resources.food -= FOOD_STORAGE_COST.food;

    GameState.structures.storageCount = 1;
    GameState.structures.hasStorage = true;

    updateResources();
    saveGame();

    addLogEntry("Vorratskammer gebaut!", "success");
    updateStatus("Maximale Nahrungskapazität deutlich erhöht!");
}

/* ---------- UI ---------- */

function updateFoodStorageUI()
{
    if (!FOOD_STORAGE_DOM.buyButton)
    {
        return;
    }

    if (GameState.structures.storageCount > 0)
    {
        FOOD_STORAGE_DOM.buyButton.disabled = true;
        FOOD_STORAGE_DOM.buyButton.textContent = "Errichtet";

        if (FOOD_STORAGE_DOM.card)
        {
            FOOD_STORAGE_DOM.card.classList.add("unlocked");
        }
    }
    else
    {
        FOOD_STORAGE_DOM.buyButton.disabled =
            !GameState.achievements.smallColony || !canAffordFoodStorage();
    }
}

onDOMReady(initFoodStorageDOM);
