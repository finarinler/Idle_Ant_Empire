/* =========================
    Initialization
========================= */

function initDOM()
{
    DOM.foodCount = document.getElementById(
        "food-count"
    );

    DOM.foodMax = document.getElementById(
        "food-max"
    );

    DOM.foodRate = document.getElementById(
        "food-rate"
    );

    DOM.larvaeCount = document.getElementById(
        "larvae-count"
    );

    DOM.larvaeMax = document.getElementById(
        "larvae-max"
    );

    DOM.larvaeRate = document.getElementById(
        "larvae-rate"
    );

    DOM.antCount = document.getElementById(
        "ant-count"
    );

    DOM.antTotal = document.getElementById(
        "ant-total"
    );

    DOM.antBought = document.getElementById(
        "ant-bought"
    );

    DOM.antCostDisplay = document.getElementById(
        "ant-cost-display"
    );

    DOM.queenCount = document.getElementById(
        "queen-count"
    );

    DOM.queenTotal = document.getElementById(
        "queen-total"
    );

    DOM.queenBought = document.getElementById(
        "queen-bought"
    );

    DOM.queenCostDisplay = document.getElementById(
        "queen-cost-display"
    );

    DOM.versionTag = document.getElementById(
        "version-tag"
    );

    DOM.title = document.getElementById(
        "game-title"
    );

    DOM.expeditionBtn = document.getElementById(
        "expedition-btn"
    );

    DOM.expeditionProgress = document.getElementById(
        "expedition-progress"
    );

    DOM.expeditionText = document.getElementById(
        "expedition-text"
    );

    DOM.buyAntBtn = document.getElementById(
        "buy-ant-btn"
    );

    DOM.buyQueenBtn = document.getElementById(
        "buy-queen-btn"
    );

    DOM.buyStorageBtn = document.getElementById(
        "buy-storage-btn"
    );

    DOM.buyNurseryBtn = document.getElementById(
        "buy-nursery-btn"
    );

    DOM.cardStorage = document.getElementById(
        "card-storage"
    );

    DOM.cardNursery = document.getElementById(
        "card-nursery"
    );

    DOM.flashOverlay = document.getElementById(
        "flash-overlay"
    );

    DOM.trophyOverlay = document.getElementById(
        "achievement-trophy-overlay"
    );

    DOM.logContainer = document.getElementById(
        "log-container"
    );

    DOM.logContent = document.getElementById(
        "log-content"
    );

    DOM.logToggleBtn = document.getElementById(
        "log-toggle-btn"
    );

    DOM.logResetBtn = document.getElementById(
        "log-reset-btn"
    );

    DOM.gameResetBtn = document.getElementById(
        "game-reset-btn"
    );

    DOM.legendContainer = document.getElementById(
        "legend-container"
    );

    DOM.legendToggleBtn = document.getElementById(
        "legend-toggle-btn"
    );

    DOM.achievementContainer = document.getElementById(
        "achievement-container"
    );

    DOM.achievementToggleBtn = document.getElementById(
        "achievement-toggle-btn"
    );

    DOM.achievementList = document.getElementById(
        "achievement-list"
    );

    DOM.noAchievementsMsg = document.getElementById(
        "no-achievements-msg"
    );

    DOM.statusText = document.getElementById(
        "status-text"
    );

    DOM.catBasisStructures = document.getElementById(
        "cat-basis-structures"
    );

    // Zuweisung Elite-Einheiten
    DOM.catEliteUnits = document.getElementById(
        "cat-elite-units"
    );

    DOM.buyEliteSoldierBtn = document.getElementById(
        "buy-soldier-btn"
    );

    DOM.eliteSoldierCount = document.getElementById(
        "soldier-count"
    );

    DOM.eliteSoldierTotal = document.getElementById(
        "soldier-total"
    );

    DOM.versionTag = document.getElementById(
        "version-tag-display"
    );

    if (!DOM.versionTag)
    {
        DOM.versionTag = document.querySelector(
            ".version-tag"
        );
    }

    // Sofortige Anzeige der Version beim Start
    if (DOM.versionTag)
    {
        DOM.versionTag.textContent = GAME_VERSION;
    }
}

function attachEventListeners()
{
    if (DOM.expeditionBtn)
    {
        DOM.expeditionBtn.onclick = startExpedition;
    }

    if (DOM.buyAntBtn)
    {
        DOM.buyAntBtn.onclick = buyAnt;
    }

    if (DOM.buyQueenBtn)
    {
        DOM.buyQueenBtn.onclick = buyQueen;
    }

    if (DOM.buyStorageBtn)
    {
        DOM.buyStorageBtn.onclick = buyStorage;
    }

    if (DOM.buyNurseryBtn)
    {
        DOM.buyNurseryBtn.onclick = buyNursery;
    }

    if (DOM.logToggleBtn)
    {
        DOM.logToggleBtn.onclick = toggleLog;
    }

    if (DOM.legendToggleBtn)
    {
        DOM.legendToggleBtn.onclick = toggleLegend;
    }

    if (DOM.achievementToggleBtn)
    {
        DOM.achievementToggleBtn.onclick = toggleAchievement;
    }

    if (DOM.logResetBtn)
    {
        DOM.logResetBtn.onclick = clearLog;
    }

    if (DOM.gameResetBtn)
    {
        DOM.gameResetBtn.onclick = resetGame;
    }
}

function injectVersion()
{
    if (DOM.versionTag)
    {
        DOM.versionTag.textContent = GAME_VERSION;
    }

    document.title = `Idle Ant Empire - ${GAME_VERSION}`;
}

function initGame()
{
    initDOM();

    injectVersion();

    loadGame();

    attachEventListeners();
    
    setInterval(
        gameTick,
        CORE_CONFIG.TICK_INTERVAL_MS
    );
    
    setInterval(
        saveGame,
        CORE_CONFIG.SAVE_INTERVAL_MS
    );
}