/* =========================
    Offline-Fortschritt
========================= */

function applyOfflineProgress()
{
    const lastSaveTimestamp = GameState.time.lastSaveTimestamp;

    if (!Number.isFinite(lastSaveTimestamp) || lastSaveTimestamp <= 0)
    {
        return 0;
    }

    const elapsedMs = Date.now() - lastSaveTimestamp;

    if (elapsedMs <= 0)
    {
        return 0;
    }

    const cappedElapsedMs = Math.min(elapsedMs, CORE_CONFIG.MAX_OFFLINE_TIME_MS);
    const offlineSeconds = Math.floor(cappedElapsedMs / 1000);

    if (offlineSeconds <= 0)
    {
        return 0;
    }

    for (let second = 0; second < offlineSeconds; second++)
    {
        updateProduction(false);
    }

    updateResources();

    return offlineSeconds;
}
