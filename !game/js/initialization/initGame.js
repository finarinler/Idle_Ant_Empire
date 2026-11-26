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

function showVersionUpdateNotice()
{
    const rolloutKey = "idleAntEmpireVersionNoticeRollout";
    const duration = 5 * 60 * 1000;
    const now = Date.now();
    let shownVersion = null;

    try { shownVersion = localStorage.getItem(rolloutKey); } catch (_) {}

    // Jede neue Spielversion wird einmalig angekündigt. Der separate Rollout-Schlüssel
    // macht die Anzeige unabhängig von älteren, fehlerhaften Notice-Einträgen und Spielständen.
    if (shownVersion === GAME_VERSION) return;

    const header = document.querySelector(".sticky-top");
    if (!header) return;

    const style = document.createElement("style");
    style.textContent = ".header-version-update{display:block;margin:8px auto 0;padding:10px 14px;max-width:100%;text-align:center;border:1px solid rgba(143,191,139,.55);border-radius:9px;background:rgba(38,83,43,.28);color:#c9efc5;font-size:.84rem;font-weight:800;letter-spacing:.02em;box-shadow:0 2px 12px rgba(0,0,0,.18)}";
    document.head.appendChild(style);

    const notice = document.createElement("div");
    notice.className = "header-version-update";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.setAttribute("data-i18n", "status.versionUpdateAvailable");
    notice.textContent = I18N.t("status.versionUpdateAvailable");

    const statusButton = document.getElementById("status-logbook-button");
    const maintenanceLine = statusButton && statusButton.nextElementSibling;
    if (maintenanceLine && maintenanceLine.classList.contains("header-maintenance-line"))
        maintenanceLine.insertAdjacentElement("afterend", notice);
    else if (statusButton)
        statusButton.insertAdjacentElement("afterend", notice);
    else
        header.appendChild(notice);

    try { localStorage.setItem(rolloutKey, GAME_VERSION); } catch (_) {}
    window.setTimeout(() => notice.remove(), duration);
}

function initGame()
{
    // Karten aus den Katalogen erzeugen, bevor Spielstand und Freischaltungen angewendet werden
    CardBuilder.mountAll();

    initDOM();
    I18N.applyStatic();
    injectVersion();
    showVersionUpdateNotice();
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
