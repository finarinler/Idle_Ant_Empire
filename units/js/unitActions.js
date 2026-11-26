/* =========================
    Einheiten – Aktionen (UI-Anbindung)
    Die Karten rufen diese Funktionen auf. Gekauft wird ausschließlich über die
    zentrale Wirtschaft (Economy.recruit). Hier wird nichts verbucht.
========================= */

function recruitUnit(id)
{
    const result = Economy.recruit(id);

    if (!result.ok)
    {
        updateStatus(result.reason.key || "status.elite.cannotAfford", "warning", false, result.reason.params || null);
        return false;
    }

    const def = UnitRegistry.get(id);
    updateStatus("status.unit.trainingStarted", "status", false, { unit: { key: def.nameKey } });

    updateResources();
    return true;
}

function recruitUnitBatch(id, amount)
{
    const options = Economy.getTrainingBatchOptions(id);
    const quantity = amount === "max" ? options.max : amount;
    const factor = quantity >= 26 ? 0.80 : quantity >= 25 ? 0.85 : quantity >= 10 ? 0.90 : 1;
    const result = Economy.recruitBatch(id, quantity, factor);
    if (!result.ok)
    {
        updateStatus(result.reason?.key || "status.elite.cannotAfford", "warning");
        return false;
    }
    const def = UnitRegistry.get(id);
    updateStatus("status.unit.trainingQueued", "status", false, { count: quantity, unit: { key: def.nameKey } });
    updateResources();
    if (typeof CardBuilder !== "undefined") { CardBuilder.updateAll(); }
    return true;
}

function buyAnt()             { return recruitUnit("normal-ant"); }
function buyQueen()           { return recruitUnit("queen"); }
function buyCollector()       { return recruitUnit("collector"); }
function buyBroodExpert()     { return recruitUnit("brood-expert"); }

function isBroodExpertOn()
{
    return GameState.economy.broodExpertEnabled !== false;
}

function toggleBroodExpert()
{
    if (Economy.getUnitNumber("brood-expert") <= 0) { return false; }

    // Erst bis zum Klickzeitpunkt mit dem bisherigen Zustand abrechnen.
    Economy.update();
    GameState.economy.broodExpertEnabled = !isBroodExpertOn();

    updateStatus(isBroodExpertOn() ? "status.broodExpert.on" : "status.broodExpert.off", "status");
    updateResources();
    if (typeof CardBuilder !== "undefined") { CardBuilder.updateAll(); }
    saveGame();
    return true;
}
function buyBuilder()         { return recruitUnit("builder"); }
function buyStorageGuardian() { return recruitUnit("storage-keeper"); }
function buyGrandNurse()      { return recruitUnit("grand-nurse"); }

function buyScout()
{
    return recruitUnit("scout");
}

/* ---------- Späher: Automatik ON/OFF ---------- */

function toggleScoutAutomation()
{
    if (!hasScout())
    {
        return;
    }

    GameState.expedition.scoutEnabled = !GameState.expedition.scoutEnabled;
    GameState.expedition.scoutRestUntil = 0;

    updateStatus(GameState.expedition.scoutEnabled ? "status.scout.automationOn" : "status.scout.automationOff", "status");
    updateExpeditionButtonState();
    updateResources();
}

// Automatik (jeder Tick). Alle Bedingungen prüft startScoutExpedition().
function updateScoutAutomation()
{
    startScoutExpedition();
}

/* ---------- Ausbildungsfortschritt (reine Anzeige) ---------- */

function updateTrainingProgressUI()
{
    Object.keys(BALANCE.trainingSeconds).forEach(unitId =>
    {
        const bar = document.getElementById(`training-${unitId}-progress`);
        if (!bar) { return; }

        const training = GameState.economy.trainings[unitId];

        // Der Balken bleibt dauerhaft sichtbar – im Leerlauf steht er bei 0 %.
        bar.style.width = `${(training ? Economy.getTrainingProgress(unitId) * 100 : 0).toFixed(1)}%`;
    });
}

/* ---------- Schlupf-Fortschritt der Brutexpertinnen (reine Anzeige) ---------- */

function updateBroodExpertProgressUI()
{
    const bar = document.getElementById("brood-expert-progress");

    if (bar)
    {
        bar.style.width = `${(Economy.getHatchProgress() * 100).toFixed(1)}%`;
    }
}
