/* =========================
    Brutkammer
    Erhöht das Larvenlimit (siehe core/capacity.js)
========================= */

const LARVAE_STORAGE_COST = {
    food: 3000,
    larvae: 150,
    ants: 150,
    queens: 10
};

// Reihenfolge der Kosten in der Anzeige
const LARVAE_STORAGE_COST_ORDER = ["larvae", "ants", "queens", "food"];

const LARVAE_STORAGE_DOM = {
    card: null,
    costDisplay: null,
    buyButton: null
};

function initLarvaeStorageDOM()
{
    LARVAE_STORAGE_DOM.card = getEl("card-nursery");
    LARVAE_STORAGE_DOM.costDisplay = getEl("nursery-cost-display");
    LARVAE_STORAGE_DOM.buyButton = getEl("buy-nursery-btn");

    if (LARVAE_STORAGE_DOM.buyButton)
    {
        LARVAE_STORAGE_DOM.buyButton.onclick = buyNursery;
    }
}

function canAffordLarvaeStorage()
{
    return canAffordCost(LARVAE_STORAGE_COST);
}

/* ---------- Bau ---------- */

function buyNursery()
{
    if (GameState.structures.nurseryCount > 0 || !canAffordLarvaeStorage())
    {
        return;
    }

    if (!payCost(LARVAE_STORAGE_COST))
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

/* ---------- UI ---------- */

function updateLarvaeStorageUI()
{
    if (!LARVAE_STORAGE_DOM.buyButton)
    {
        return;
    }

    renderCostLine(LARVAE_STORAGE_DOM.costDisplay, LARVAE_STORAGE_COST, LARVAE_STORAGE_COST_ORDER);

    if (GameState.structures.nurseryCount > 0)
    {
        LARVAE_STORAGE_DOM.buyButton.disabled = true;
        I18N.setText(LARVAE_STORAGE_DOM.buyButton, "button.built");

        if (LARVAE_STORAGE_DOM.card)
        {
            LARVAE_STORAGE_DOM.card.classList.add("unlocked");
        }
    }
    else
    {
        I18N.setText(LARVAE_STORAGE_DOM.buyButton, "button.build");

        LARVAE_STORAGE_DOM.buyButton.disabled =
            !GameState.achievements.smallColony || !canAffordLarvaeStorage();
    }
}

onDOMReady(initLarvaeStorageDOM);
