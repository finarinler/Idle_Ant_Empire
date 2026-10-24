/* =========================
    Vorratskammer
    Erhöht das Nahrungslimit (siehe core/capacity.js)
========================= */

const FOOD_STORAGE_COST = {
    larvae: 50,
    ants: 100,
    queens: 10,
    food: 1000
};

// Reihenfolge der Kosten in der Anzeige
const FOOD_STORAGE_COST_ORDER = ["larvae", "ants", "queens", "food"];

const FOOD_STORAGE_DOM = {
    card: null,
    costDisplay: null,
    buyButton: null
};

function initFoodStorageDOM()
{
    FOOD_STORAGE_DOM.card = getEl("card-storage");
    FOOD_STORAGE_DOM.costDisplay = getEl("storage-cost-display");
    FOOD_STORAGE_DOM.buyButton = getEl("buy-storage-btn");

    if (FOOD_STORAGE_DOM.buyButton)
    {
        FOOD_STORAGE_DOM.buyButton.onclick = buyStorage;
    }
}

function canAffordFoodStorage()
{
    return canAffordCost(FOOD_STORAGE_COST);
}

/* ---------- Bau ---------- */

function buyStorage()
{
    if (GameState.structures.storageCount > 0 || !canAffordFoodStorage())
    {
        return;
    }

    if (!payCost(FOOD_STORAGE_COST))
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

/* ---------- UI ---------- */

function updateFoodStorageUI()
{
    if (!FOOD_STORAGE_DOM.buyButton)
    {
        return;
    }

    renderCostLine(FOOD_STORAGE_DOM.costDisplay, FOOD_STORAGE_COST, FOOD_STORAGE_COST_ORDER);

    if (GameState.structures.storageCount > 0)
    {
        FOOD_STORAGE_DOM.buyButton.disabled = true;
        I18N.setText(FOOD_STORAGE_DOM.buyButton, "button.built");

        if (FOOD_STORAGE_DOM.card)
        {
            FOOD_STORAGE_DOM.card.classList.add("unlocked");
        }
    }
    else
    {
        I18N.setText(FOOD_STORAGE_DOM.buyButton, "button.build");

        FOOD_STORAGE_DOM.buyButton.disabled =
            !GameState.achievements.smallColony || !canAffordFoodStorage();
    }
}

onDOMReady(initFoodStorageDOM);
