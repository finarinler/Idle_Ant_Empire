/* =========================
    Vorrats-Hüterin
    Verdoppelt das Nahrungslager (siehe core/capacity.js)
========================= */

const STORAGE_GUARDIAN_CONFIG = {
    cost: { ants: 150, food: 7500, larvae: 2000, queens: 1 },
    costMultiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
    upkeep: 1,
    maxCount: 5
};

const STORAGE_GUARDIAN_DOM = {
    count: null,
    costDisplay: null,
    buyButton: null
};

function initStorageGuardianDOM()
{
    STORAGE_GUARDIAN_DOM.count = getEl("guardian-count");
    STORAGE_GUARDIAN_DOM.costDisplay = getEl("guardian-cost-display");
    STORAGE_GUARDIAN_DOM.buyButton = getEl("buy-guardian-btn");

    if (STORAGE_GUARDIAN_DOM.buyButton)
    {
        STORAGE_GUARDIAN_DOM.buyButton.onclick = buyStorageGuardian;
    }
}

/* ---------- Kosten ---------- */

function getStorageGuardianCost()
{
    return getScaledCost(
        STORAGE_GUARDIAN_CONFIG.cost,
        STORAGE_GUARDIAN_CONFIG.costMultiplier,
        GameState.eliteUnits.storageGuardianCount || 0
    );
}

/* ---------- Kauf ---------- */

function buyStorageGuardian()
{
    const count = GameState.eliteUnits.storageGuardianCount || 0;

    if (!hasEliteRequirements())
    {
        updateStatus(ELITE_REQUIREMENT_MESSAGE, "warning");
        return;
    }

    if (count >= STORAGE_GUARDIAN_CONFIG.maxCount)
    {
        updateStatus("Du hast bereits die maximale Anzahl dieser Elite-Einheit ausgebildet.", "warning");
        return;
    }

    const cost = getStorageGuardianCost();

    if (!canAffordCost(cost))
    {
        updateStatus("Ressourcen für diese Elite-Einheit reichen nicht aus.", "warning");
        return;
    }

    payCost(cost);
    GameState.eliteUnits.storageGuardianCount = count + 1;

    updateStatus("Vorrats-Hüterin ausgebildet! Deine Nahrungslagerkapazität wird erhöht.", "success");

    updateResources();
    saveGame();
}

/* ---------- Unterhalt (Nahrung pro Sekunde) ---------- */

function getStorageGuardianFoodConsumption()
{
    return (GameState.eliteUnits.storageGuardianCount || 0) * STORAGE_GUARDIAN_CONFIG.upkeep;
}

/* ---------- UI ---------- */

function updateStorageGuardianUI()
{
    const count = GameState.eliteUnits.storageGuardianCount || 0;
    const cost = getStorageGuardianCost();

    if (STORAGE_GUARDIAN_DOM.count)
    {
        STORAGE_GUARDIAN_DOM.count.textContent = formatGameNumber(count);
    }

    if (STORAGE_GUARDIAN_DOM.costDisplay)
    {
        STORAGE_GUARDIAN_DOM.costDisplay.textContent = formatCostLine(cost);
    }

    setTrainButtonState(STORAGE_GUARDIAN_DOM.buyButton, {
        unlocked: hasEliteRequirements(),
        maxReached: count >= STORAGE_GUARDIAN_CONFIG.maxCount,
        canAfford: canAffordCost(cost)
    });
}

onDOMReady(initStorageGuardianDOM);
