/* =========================
    Expedition: Start & Fortschritt

    Es gibt zwei erlaubte Startwege, die jeweils selbst alle Voraussetzungen prüfen:
      - startExpedition():       manueller Start (nur ohne Kundschafterin)
      - startScoutExpedition():  automatischer Start durch die Kundschafterin
    Beide enden in beginExpedition(), das keine zweite Expedition starten lässt.
========================= */

function getExpeditionDurationMs()
{
    return GameState.achievements.speedExpeditions
        ? CORE_CONFIG.EXPEDITION_DURATION_FAST_MS
        : CORE_CONFIG.EXPEDITION_DURATION_MS;
}

/* ---------- Zustand (alles wird aus dem GameState abgeleitet) ---------- */

function hasScout()
{
    return (GameState.eliteUnits.scoutCount || 0) > 0;
}

// Der Expeditionsbutton ist gesperrt, solange eine Expedition läuft
// oder eine Kundschafterin existiert (dann laufen Expeditionen automatisch).
function isExpeditionButtonLocked()
{
    return GameState.expedition.isActive || hasScout();
}

function canBeginExpedition()
{
    return !GameState.ui.isResetting && !GameState.expedition.isActive;
}

/* ---------- Start ---------- */

function beginExpedition()
{
    if (!canBeginExpedition())
    {
        return false;
    }

    GameState.expedition.isActive = true;
    GameState.expedition.startTime =
        Date.now() - (GameState.expedition.progress / 100) * getExpeditionDurationMs();

    setExpeditionRunningUI();
    updateStatus("status.expeditionStarted", "status", true);

    return true;
}

// Manueller Start. Mit Kundschafterin ist er dauerhaft gesperrt.
function startExpedition()
{
    if (hasScout())
    {
        return false;
    }

    return beginExpedition();
}

// Automatischer Start durch die Kundschafterin (jeder Tick, siehe scout.js)
function startScoutExpedition()
{
    if (!hasScout())
    {
        return false;
    }

    if (Date.now() < GameState.expedition.scoutRestUntil)
    {
        return false;
    }

    return beginExpedition();
}

// Klick auf den Expeditionsbutton
function handleExpeditionButtonClick()
{
    if (hasScout())
    {
        updateStatus("status.expeditionLockedByScout", "warning");
        return;
    }

    startExpedition();
}

// Wird jeden Tick aus gameTick() aufgerufen
function updateExpedition()
{
    if (!GameState.expedition.isActive)
    {
        return;
    }

    const duration = getExpeditionDurationMs();
    const elapsed = Date.now() - GameState.expedition.startTime;
    const progress = Math.max(0, Math.min((elapsed / duration) * 100, 100));

    GameState.expedition.progress = progress;
    updateExpeditionProgressUI(progress);

    if (elapsed >= duration)
    {
        completeExpedition();
    }
}

// Beim Spielstart: gespeicherte Expedition mit ihrem Fortschritt fortsetzen,
// ohne die Offline-Zeit anzurechnen
function resumeExpedition()
{
    if (GameState.expedition.isActive)
    {
        const progress = Math.max(0, Math.min(GameState.expedition.progress || 0, 100));

        GameState.expedition.progress = progress;
        GameState.expedition.startTime = Date.now() - (progress / 100) * getExpeditionDurationMs();
    }

    restoreExpeditionUI();
}
