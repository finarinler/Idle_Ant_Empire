/* =========================
    Spielstart
========================= */

function injectVersion()
{
    if (DOM.versionTag)
    {
        DOM.versionTag.textContent = GAME_VERSION;
    }

    const changelogNavVersion = document.getElementById("changelog-nav-version");
    if (changelogNavVersion)
    {
        changelogNavVersion.textContent = GAME_VERSION;
    }

    const changelogCurrentVersion = document.getElementById("changelog-current-version");
    if (changelogCurrentVersion)
    {
        changelogCurrentVersion.textContent = GAME_VERSION;
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

    // Wirtschaftsgebäude (Wohnkammer, Pilzfarm) sind von Beginn an verfügbar
    unlockStructuresUI(true);

    // Gespeicherten Spielstand laden
    loadGame();

    // Offline-Produktion und abgeschlossene Ausbildungen nachholen
    const offlineResult = applyOfflineProgress();
    handleEconomyResult(offlineResult);

    // Laufende Expedition fortsetzen bzw. Button-Text setzen
    resumeExpedition();

    attachEventListeners();
    if (typeof initStatistics === "function") initStatistics();
    updateResources();
    refreshAchievementButtonTitle();

    saveGame();
    startGameLoop();
}
