/* =========================
    Expedition: Start & Fortschritt
========================= */

function getExpeditionDurationMs()
{
    return GameState.achievements.speedExpeditions
        ? CORE_CONFIG.EXPEDITION_DURATION_FAST_MS
        : CORE_CONFIG.EXPEDITION_DURATION_MS;
}

function startExpedition()
{
    if (GameState.expedition.isActive)
    {
        return;
    }

    GameState.expedition.isActive = true;
    GameState.expedition.startTime =
        Date.now() - (GameState.expedition.progress / 100) * getExpeditionDurationMs();

    setExpeditionRunningUI();
    updateStatus("Deine Kolonie ist auf Expedition", "status", true);
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
    const progress = Math.min((elapsed / duration) * 100, 100);

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
