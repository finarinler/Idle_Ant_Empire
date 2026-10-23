
/* =========================
    Brut-Expertin
========================= */

const BROOD_EXPERT_CONFIG = {
    cost: { ants: 100, food: 1000, larvae: 250, queens: 1 },
    costMultiplier: { ants: 1.75, food: 1.5, larvae: 1.75, queens: 2 },
    larvaeConsumption: 0.4,
    larvaePerUnit: 2,
    productionInterval: 5,
    maxCount: 5
};

const BROOD_EXPERT_DOM = {
    count: null,
    costDisplay: null,
    card: null,
    progress: null,
    buyButton: null
};

let broodExpertAnimationFrame = null;
let broodExpertAnimationStartTime = null;
let broodExpertAnimationStartProgress = 0;
let broodExpertAnimationCycle = 0;

/* ---------- Initialisierung ---------- */

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

    updateBroodExpertUI();
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
        updateStatus(
            "Du hast bereits die maximale Anzahl dieser Elite-Einheit ausgebildet.",
            "warning"
        );
        return;
    }

    const cost = getBroodExpertCost();

    if (!canAffordCost(cost))
    {
        updateStatus(
            "Ressourcen für diese Elite-Einheit reichen nicht aus.",
            "warning"
        );
        return;
    }

    payCost(cost);
    GameState.eliteUnits.broodExpertCount = count + 1;

    updateStatus("Brut-Expertin ausgebildet!", "success");

    updateResources();
    updateBroodExpertUI();
    saveGame();
}

/* ---------- Produktion (1x pro Sekunde) ---------- */

function updateBroodExpertProduction()
{
    const count = GameState.eliteUnits.broodExpertCount || 0;

    if (count <= 0)
    {
        GameState.eliteUnits.broodExpertProgress = 0;
        stopBroodExpertProgressAnimation();
        updateBroodExpertProgressUI();
        return;
    }

    const larvaeRequired = count * BROOD_EXPERT_CONFIG.larvaePerUnit;

    if (GameState.resources.larvae < larvaeRequired)
    {
        stopBroodExpertProgressAnimation();
        updateBroodExpertProgressUI();
        return;
    }

    const progress = GameState.eliteUnits.broodExpertProgress || 0;
    const interval = BROOD_EXPERT_CONFIG.productionInterval;

    // Pausentick: Der vorherige Tick hat die Produktion
    // abgeschlossen. Jetzt beginnt ein neuer Zyklus.
    if (progress > interval)
    {
        GameState.eliteUnits.broodExpertProgress = 0;

        stopBroodExpertProgressAnimation();
        updateBroodExpertProgressUI();
        return;
    }

    // Produktionszyklus abschließen und einen Pausentick setzen.
    if (progress === interval)
    {
        GameState.resources.larvae -= larvaeRequired;
        GameState.resources.bredAnts += count;

        // interval + 1 kennzeichnet den Pausentick.
        GameState.eliteUnits.broodExpertProgress = interval + 1;

        stopBroodExpertProgressAnimation();

        if (BROOD_EXPERT_DOM.progress)
        {
            BROOD_EXPERT_DOM.progress.style.width = "100%";
        }

        return;
    }

    // Regulärer Fortschritt.
    GameState.eliteUnits.broodExpertProgress = progress + 1;

    updateBroodExpertProgressUI();
}

/* ---------- Larven-Verbrauch pro Sekunde ---------- */

function getBroodExpertLarvaeConsumption()
{
    return (
        GameState.eliteUnits.broodExpertCount || 0
    ) * BROOD_EXPERT_CONFIG.larvaeConsumption;
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

    updateBroodExpertProgressUI();

    setTrainButtonState(BROOD_EXPERT_DOM.buyButton, {
        unlocked: unlocked,
        maxReached: count >= BROOD_EXPERT_CONFIG.maxCount,
        canAfford: canAffordCost(cost)
    });
}

/* ---------- Fortschrittsbalken ---------- */

function updateBroodExpertProgressUI()
{
    const bar = BROOD_EXPERT_DOM.progress;

    if (!bar)
    {
        return;
    }

    const count = GameState.eliteUnits.broodExpertCount || 0;
    const progress = GameState.eliteUnits.broodExpertProgress || 0;
    const larvaeRequired = count * BROOD_EXPERT_CONFIG.larvaePerUnit;
    const interval = BROOD_EXPERT_CONFIG.productionInterval;

    if (
        count <= 0 ||
        GameState.resources.larvae < larvaeRequired
    )
    {
        stopBroodExpertProgressAnimation();
        bar.style.width = "0%";
        return;
    }

    // Während des Pausenticks bleibt der Balken vollständig gefüllt.
    if (progress > interval)
    {
        stopBroodExpertProgressAnimation();
        bar.style.width = "100%";
        return;
    }

    // Eine aktive Animation nicht durch UI-Updates neu starten.
    if (broodExpertAnimationFrame !== null)
    {
        return;
    }

    const percentage = Math.min(100, (progress / interval) * 100);

    bar.style.width = `${percentage}%`;

    if (progress > 0 && progress < interval)
    {
        startBroodExpertProgressAnimation(progress, interval);
    }
}

/* ---------- Animation ---------- */

function startBroodExpertProgressAnimation(progress, interval)
{
    const bar = BROOD_EXPERT_DOM.progress;

    if (!bar)
    {
        return;
    }

    stopBroodExpertProgressAnimation();

    const cycle = ++broodExpertAnimationCycle;
    const startTime = performance.now();
    const duration = (interval - progress) * 1000;
    const startPercentage = (progress / interval) * 100;

    function animate(now)
    {
        if (cycle !== broodExpertAnimationCycle)
        {
            return;
        }

        const count = GameState.eliteUnits.broodExpertCount || 0;
        const larvaeRequired = count * BROOD_EXPERT_CONFIG.larvaePerUnit;

        if (
            !bar.isConnected ||
            count <= 0 ||
            GameState.resources.larvae < larvaeRequired
        )
        {
            stopBroodExpertProgressAnimation();
            bar.style.width = "0%";
            return;
        }

        const elapsed = now - startTime;
        const ratio = Math.min(elapsed / duration, 1);

        const percentage =
            startPercentage + (100 - startPercentage) * ratio;

        bar.style.width = `${percentage}%`;

        if (ratio < 1)
        {
            broodExpertAnimationFrame = requestAnimationFrame(animate);
        }
        else
        {
            bar.style.width = "100%";
            broodExpertAnimationFrame = null;
        }
    }

    broodExpertAnimationFrame = requestAnimationFrame(animate);
}

function stopBroodExpertProgressAnimation()
{
    broodExpertAnimationCycle++;

    if (broodExpertAnimationFrame !== null)
    {
        cancelAnimationFrame(broodExpertAnimationFrame);
        broodExpertAnimationFrame = null;
    }

    broodExpertAnimationStartTime = null;
    broodExpertAnimationStartProgress = 0;
}

onDOMReady(initBroodExpertDOM);
