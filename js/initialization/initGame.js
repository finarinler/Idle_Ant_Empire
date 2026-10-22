/* =========================
    Spielstart
========================= */

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
    setDefaultStatus();

    // Gespeicherten Spielstand laden
    loadGame();

    // Offline-Produktion nachholen, bevor der Speicherzeitpunkt neu gesetzt wird
    applyOfflineProgress();

    // Laufende Expedition fortsetzen bzw. Button-Text setzen
    resumeExpedition();

    attachEventListeners();
    updateResources();

    saveGame();
    startGameLoop();
}
