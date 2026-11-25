/* =========================
    Offline-Fortschritt
    Verwendet exakt dieselbe zentrale Wirtschaft wie der Onlinebetrieb
    (Economy.advance). Maximal 2 Stunden, Rest wird verworfen.
    Expeditionen laufen offline nicht weiter.
========================= */

function applyOfflineProgress()
{
    const now = Date.now();
    const lastSaveTimestamp = GameState.time.lastSaveTimestamp;

    GameState.economy.lastUpdateMs = now;

    if (!Number.isFinite(lastSaveTimestamp) || lastSaveTimestamp <= 0)
    {
        return null;
    }

    const elapsedMs = now - lastSaveTimestamp;

    if (elapsedMs <= 0)
    {
        return null;
    }

    const cappedMs = Math.min(elapsedMs, CORE_CONFIG.MAX_OFFLINE_TIME_MS);
    const result = Economy.advance(cappedMs / 1000);

    GameState.economy.lastUpdateMs = Date.now();

    return result;
}
