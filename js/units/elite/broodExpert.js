/* =========================
    Brut-Expertin
    Züchtet alle 5 Sekunden neue Ameisen aus Larven
========================= */

const BROOD_EXPERT_CONFIG = {
    cost: { ants: 100, food: 1000, larvae: 250, queens: 1 },
    costMultiplier: { ants: 1.75, food: 1.5, larvae: 1.75, queens: 2 },
    larvaeConsumption: 0.4,   // nur für die Raten-Anzeige (Larven pro Sekunde und Expertin)
    larvaePerUnit: 2,         // Larven pro Zyklus und Expertin
    productionInterval: 5,    // Sekunden pro Zyklus
    maxCount: 5
};

const BROOD_EXPERT_DOM = {
    count: null,
    costDisplay: null,
    card: null,
    progress: null,
    buyButton: null
};

function initBroodExpertDOM()
{
    BROOD_EXPERT_DOM.count = getEl("brood-expert-count");
    BROOD_EXPERT_DOM.costDisplay = getEl("brood-expert-cost-display");
    BROOD_EXPERT_DOM.card = getEl("card-brood-expert");
    BROOD_EXPERT_DOM.progress = getEl("brood-expert-progress");
    BROOD_EXPERT_DOM.buyButton = getEl("buy-brood-expert-btn");

    if (BROOD_EXPERT_DOM.buyButton)
    {
        BROOD_EXPERT_DOM.buyButton.onclick = buyBroodExpert;
    }
}

/* ---------- Kosten ---------- */

function getBroodExpertCost()
{
    return getScaledCost(
        BROOD_EXPERT_CONFIG.cost,
        BROOD_EXPERT_CONFIG.costMultiplier,
        GameState.eliteUnits.broodExpertCount || 0
    );
}

/* ---------- Kauf ---------- */

function buyBroodExpert()
{
    const count = GameState.eliteUnits.broodExpertCount || 0;

    if (!hasEliteRequirements())
    {
        updateStatus(ELITE_REQUIREMENT_MESSAGE, "warning");
        return;
    }

    if (count >= BROOD_EXPERT_CONFIG.maxCount)
    {
        updateStatus("Du hast bereits die maximale Anzahl dieser Elite-Einheit ausgebildet.", "warning");
        return;
    }

    const cost = getBroodExpertCost();

    if (!canAffordCost(cost))
    {
        updateStatus("Ressourcen für diese Elite-Einheit reichen nicht aus.", "warning");
        return;
    }

    payCost(cost);
    GameState.eliteUnits.broodExpertCount = count + 1;

    updateStatus("Brut-Expertin ausgebildet!", "success");

    updateResources();
    saveGame();
}

/* ---------- Produktion (1x pro Sekunde, aus updateProduction) ---------- */

function updateBroodExpertProduction()
{
    const count = GameState.eliteUnits.broodExpertCount || 0;

    if (count <= 0)
    {
        GameState.eliteUnits.broodExpertProgress = 0;
        return;
    }

    const larvaeRequired = count * BROOD_EXPERT_CONFIG.larvaePerUnit;

    if (GameState.resources.larvae < larvaeRequired)
    {
        return;
    }

    GameState.eliteUnits.broodExpertProgress = (GameState.eliteUnits.broodExpertProgress || 0) + 1;

    if (GameState.eliteUnits.broodExpertProgress >= BROOD_EXPERT_CONFIG.productionInterval)
    {
        GameState.resources.larvae -= larvaeRequired;
        GameState.resources.bredAnts += count;
        GameState.eliteUnits.broodExpertProgress = 0;
    }
}

/* ---------- Larven-Verbrauch pro Sekunde (Raten-Anzeige) ---------- */

function getBroodExpertLarvaeConsumption()
{
    return (GameState.eliteUnits.broodExpertCount || 0) * BROOD_EXPERT_CONFIG.larvaeConsumption;
}

/* ---------- UI ---------- */

function updateBroodExpertUI()
{
    const count = GameState.eliteUnits.broodExpertCount || 0;
    const cost = getBroodExpertCost();
    const unlocked = hasEliteRequirements();

    if (BROOD_EXPERT_DOM.count)
    {
        BROOD_EXPERT_DOM.count.textContent = formatGameNumber(count);
    }

    if (BROOD_EXPERT_DOM.costDisplay)
    {
        BROOD_EXPERT_DOM.costDisplay.textContent = formatCostLine(cost);
    }

    if (BROOD_EXPERT_DOM.card)
    {
        BROOD_EXPERT_DOM.card.classList.toggle("unlocked", unlocked);
    }

    if (BROOD_EXPERT_DOM.progress)
    {
        const progress = GameState.eliteUnits.broodExpertProgress || 0;
        const percentage = Math.min(100, (progress / BROOD_EXPERT_CONFIG.productionInterval) * 100);
        BROOD_EXPERT_DOM.progress.style.width = `${percentage}%`;
    }

    setTrainButtonState(BROOD_EXPERT_DOM.buyButton, {
        unlocked: unlocked,
        maxReached: count >= BROOD_EXPERT_CONFIG.maxCount,
        canAfford: canAffordCost(cost)
    });
}

onDOMReady(initBroodExpertDOM);
