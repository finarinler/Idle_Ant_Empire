/* =========================
    Game Loop
========================= */

let gameTickTimer = null;
let autoSaveTimer = null;

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
    // Nie zwei Timer parallel laufen lassen (sonst doppelte Produktion / Expeditionen)
    if (gameTickTimer !== null || autoSaveTimer !== null)
    {
        return;
    }

    gameTickTimer = setInterval(gameTick, CORE_CONFIG.TICK_INTERVAL_MS);
    autoSaveTimer = setInterval(saveGame, CORE_CONFIG.SAVE_INTERVAL_MS);
}
