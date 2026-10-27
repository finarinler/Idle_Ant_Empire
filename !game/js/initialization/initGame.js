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
    // Karten aus den Katalogen erzeugen, bevor Spielstand und Freischaltungen angewendet werden
    CardBuilder.mountAll();

    initDOM();
    I18N.applyStatic();
    injectVersion();
    setDefaultStatus();
    initLanguageUI();
    initOptionsMenu();

    // Gespeicherten Spielstand laden
    loadGame();

    // Offline-Produktion nachholen, bevor der Speicherzeitpunkt neu gesetzt wird
    applyOfflineProgress();

    // Laufende Expedition fortsetzen bzw. Button-Text setzen
    resumeExpedition();

    attachEventListeners();
    if (typeof initStatistics === "function") initStatistics();
    updateResources();
    refreshAchievementButtonTitle();

    saveGame();
    startGameLoop();
}
