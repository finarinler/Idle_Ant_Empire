/* =========================
    Groß-Amme
    Verdoppelt das Larvenlager (siehe core/capacity.js)
========================= */

const GRAND_NURSE_CONFIG = {
    cost: { ants: 200, food: 7500, larvae: 2000, queens: 1 },
    costMultiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
    upkeep: 1,
    maxCount: 5
};

const GRAND_NURSE_DOM = {
    count: null,
    desc: null,
    costDisplay: null,
    buyButton: null
};

function initGrandNurseDOM()
{
    GRAND_NURSE_DOM.count = getEl("nurse-matriarch-count");
    GRAND_NURSE_DOM.desc = getEl("nurse-matriarch-desc");
    GRAND_NURSE_DOM.costDisplay = getEl("nurse-matriarch-cost-display");
    GRAND_NURSE_DOM.buyButton = getEl("buy-nurse-matriarch-btn");

    if (GRAND_NURSE_DOM.buyButton)
    {
        GRAND_NURSE_DOM.buyButton.onclick = buyGrandNurse;
    }
}

/* ---------- Kosten ---------- */

function getGrandNurseCost()
{
    return getScaledCost(
        GRAND_NURSE_CONFIG.cost,
        GRAND_NURSE_CONFIG.costMultiplier,
        GameState.eliteUnits.grandNurseCount || 0
    );
}

/* ---------- Kauf ---------- */

function buyGrandNurse()
{
    const count = GameState.eliteUnits.grandNurseCount || 0;

    if (!hasEliteRequirements())
    {
        updateStatus("status.elite.requirements", "warning");
        return;
    }

    if (count >= GRAND_NURSE_CONFIG.maxCount)
    {
        updateStatus("status.elite.maxReached", "warning");
        return;
    }

    const cost = getGrandNurseCost();

    if (!canAffordCost(cost))
    {
        updateStatus("status.elite.cannotAfford", "warning");
        return;
    }

    payCost(cost);
    GameState.eliteUnits.grandNurseCount = count + 1;

    updateStatus("status.grandNurse.trained", "success");

    updateResources();
    saveGame();
}

/* ---------- Unterhalt (Nahrung pro Sekunde) ---------- */

function getGrandNurseFoodConsumption()
{
    return Big(GameState.eliteUnits.grandNurseCount || 0).mul(GRAND_NURSE_CONFIG.upkeep);
}

/* ---------- UI ---------- */

function updateGrandNurseUI()
{
    const count = GameState.eliteUnits.grandNurseCount || 0;
    const cost = getGrandNurseCost();

    if (GRAND_NURSE_DOM.count)
    {
        GRAND_NURSE_DOM.count.textContent = formatGameNumber(count);
    }

    I18N.setText(GRAND_NURSE_DOM.desc, "unit.grandNurse.desc", {
        upkeep: formatDecimal(GRAND_NURSE_CONFIG.upkeep, 2)
    });

    renderCostLine(GRAND_NURSE_DOM.costDisplay, cost);

    setTrainButtonState(GRAND_NURSE_DOM.buyButton, {
        unlocked: hasEliteRequirements(),
        maxReached: count >= GRAND_NURSE_CONFIG.maxCount,
        canAfford: canAffordCost(cost)
    });
}

onDOMReady(initGrandNurseDOM);
