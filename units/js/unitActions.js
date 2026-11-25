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

    if (def.recruit.announce)
    {
        updateStatus(def.recruit.messageKey, "success");
    }

    updateResources();
    return true;
}

function buyAnt()             { return recruitUnit("normal-ant"); }
function buyQueen()           { return recruitUnit("queen"); }
function buyCollector()       { return recruitUnit("collector"); }
function buyBroodExpert()     { return recruitUnit("brood-expert"); }
function buyBuilder()         { return recruitUnit("builder"); }
function buyStorageGuardian() { return recruitUnit("storage-keeper"); }
function buyGrandNurse()      { return recruitUnit("grand-nurse"); }

function buyScout()
{
    if (!recruitUnit("scout"))
    {
        return false;
    }

    GameState.expedition.scoutRestUntil = 0;
    GameState.expedition.scoutEnabled = true;

    updateExpeditionButtonState();
    updateResources();
    return true;
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

/* ---------- Schlupf-Fortschritt der Brutexpertinnen (reine Anzeige) ---------- */

function updateBroodExpertProgressUI()
{
    const bar = document.getElementById("brood-expert-progress");

    if (bar)
    {
        bar.style.width = `${(Economy.getHatchProgress() * 100).toFixed(1)}%`;
    }
}
