/* =========================
    Kundschafterin
    Startet Expeditionen automatisch, braucht danach eine Erholungspause
========================= */

const SCOUT_CONFIG = {
    cost: { ants: 50, food: 5000, larvae: 1000, queens: 1 },
    maxCount: 1
};

const SCOUT_DOM = {
    count: null,
    costDisplay: null,
    buyButton: null
};

function initScoutDOM()
{
    SCOUT_DOM.count = getEl("scout-count");
    SCOUT_DOM.costDisplay = getEl("scout-cost-display");
    SCOUT_DOM.buyButton = getEl("buy-scout-btn");

    if (SCOUT_DOM.buyButton)
    {
        SCOUT_DOM.buyButton.onclick = buyScout;
    }
}

/* ---------- Kauf ---------- */

function buyScout()
{
    if (!GameState.achievements.expeditionCommander)
    {
        updateStatus("Schalte zuerst den Erfolg Expeditionskommando frei.", "warning");
        return;
    }

    const count = GameState.eliteUnits.scoutCount || 0;

    if (count >= SCOUT_CONFIG.maxCount)
    {
        updateStatus("Du hast bereits eine Kundschafterin ausgebildet.", "warning");
        return;
    }

    if (!canAffordCost(SCOUT_CONFIG.cost))
    {
        updateStatus("Ressourcen für die Kundschafterin reichen nicht aus.", "warning");
        return;
    }

    payCost(SCOUT_CONFIG.cost);
    GameState.eliteUnits.scoutCount = count + 1;
    GameState.expedition.scoutRestUntil = 0;

    updateStatus("Kundschafterin ausgebildet!", "success");

    updateResources();
    saveGame();
}

/* ---------- Automatik (jeder Tick) ---------- */

function updateScoutAutomation()
{
    if ((GameState.eliteUnits.scoutCount || 0) <= 0)
    {
        return;
    }

    if (GameState.expedition.isActive)
    {
        return;
    }

    if (Date.now() < GameState.expedition.scoutRestUntil)
    {
        return;
    }

    startExpedition();
}

/* ---------- UI ---------- */

function updateScoutUI()
{
    const count = GameState.eliteUnits.scoutCount || 0;

    if (SCOUT_DOM.count)
    {
        SCOUT_DOM.count.textContent = formatGameNumber(count);
    }

    if (SCOUT_DOM.costDisplay)
    {
        SCOUT_DOM.costDisplay.textContent = formatCostLine(SCOUT_CONFIG.cost);
    }

    setTrainButtonState(SCOUT_DOM.buyButton, {
        unlocked: Boolean(GameState.achievements.expeditionCommander),
        maxReached: count >= SCOUT_CONFIG.maxCount,
        canAfford: canAffordCost(SCOUT_CONFIG.cost),
        maxText: "Bereits ausgebildet"
    });
}

onDOMReady(initScoutDOM);
