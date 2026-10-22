/* =========================
    Brutkammer
    Erhöht das Larvenlimit (siehe core/capacity.js)
========================= */

const LARVAE_STORAGE_COST = {
    food: 3000,
    larvae: 150,
    ants: 150,      // nur gekaufte Ameisen (wie bisher)
    queens: 10
};

const LARVAE_STORAGE_DOM = {
    card: null,
    buyButton: null
};

function initLarvaeStorageDOM()
{
    LARVAE_STORAGE_DOM.card = getEl("card-nursery");
    LARVAE_STORAGE_DOM.buyButton = getEl("buy-nursery-btn");

    if (LARVAE_STORAGE_DOM.buyButton)
    {
        LARVAE_STORAGE_DOM.buyButton.onclick = buyNursery;
    }
}

function canAffordLarvaeStorage()
{
    return GameState.resources.food >= LARVAE_STORAGE_COST.food
        && GameState.resources.larvae >= LARVAE_STORAGE_COST.larvae
        && GameState.resources.ants >= LARVAE_STORAGE_COST.ants
        && GameState.resources.queens >= LARVAE_STORAGE_COST.queens;
}

/* ---------- Bau ---------- */

function buyNursery()
{
    if (GameState.structures.nurseryCount > 0 || !canAffordLarvaeStorage())
    {
        return;
    }

    GameState.resources.food -= LARVAE_STORAGE_COST.food;
    GameState.resources.larvae -= LARVAE_STORAGE_COST.larvae;
    GameState.resources.ants -= LARVAE_STORAGE_COST.ants;
    GameState.resources.queens -= LARVAE_STORAGE_COST.queens;

    GameState.structures.nurseryCount = 1;
    GameState.structures.hasNursery = true;

    updateResources();
    saveGame();

    addLogEntry("Brutkammer gebaut!", "success");
    updateStatus("Maximale Larvenkapazität deutlich erhöht!");
}

/* ---------- UI ---------- */

function updateLarvaeStorageUI()
{
    if (!LARVAE_STORAGE_DOM.buyButton)
    {
        return;
    }

    if (GameState.structures.nurseryCount > 0)
    {
        LARVAE_STORAGE_DOM.buyButton.disabled = true;
        LARVAE_STORAGE_DOM.buyButton.textContent = "Errichtet";

        if (LARVAE_STORAGE_DOM.card)
        {
            LARVAE_STORAGE_DOM.card.classList.add("unlocked");
        }
    }
    else
    {
        LARVAE_STORAGE_DOM.buyButton.disabled =
            !GameState.achievements.smallColony || !canAffordLarvaeStorage();
    }
}

onDOMReady(initLarvaeStorageDOM);
