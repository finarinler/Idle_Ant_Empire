/* =========================
    Game Loop
========================= */

function gameTick()
{
    GameState.time.ticks++;

    const ticksPerSecond = 1000 / CORE_CONFIG.TICK_INTERVAL_MS;

    if (GameState.time.ticks % ticksPerSecond === 0)
    {
        updateProduction();
    }

    updateExpedition();
    updateScoutAutomation();
    updateResources();
}

function startGameLoop()
{
    setInterval(gameTick, CORE_CONFIG.TICK_INTERVAL_MS);
    setInterval(saveGame, CORE_CONFIG.SAVE_INTERVAL_MS);
}
