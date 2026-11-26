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
    const storageKey = "idleAntEmpireVersionNotice";
    const duration = 5 * 60 * 1000;
    let noticeState;

    try
    {
        noticeState = JSON.parse(localStorage.getItem(storageKey) || "null");
    }
    catch (_) { noticeState = null; }

    const now = Date.now();
    if (!noticeState || typeof noticeState !== "object")
    {
        // Bei bestehenden Spielständen die zuletzt gespielte Version als Ausgangspunkt verwenden.
        // So wird ein Update auch dann angezeigt, wenn diese Funktion erstmals live verfügbar ist.
        let previousGameVersion = null;
        try
        {
            const savedGame = JSON.parse(localStorage.getItem(CORE_CONFIG.SAVE_KEY) || "null");
            if (savedGame && typeof savedGame.gameVersion === "string")
            {
                previousGameVersion = savedGame.gameVersion;
            }
        }
        catch (_) {}

        if (previousGameVersion && previousGameVersion !== GAME_VERSION)
        {
            noticeState = { version: GAME_VERSION, expiresAt: now + duration };
        }
        else
        {
            noticeState = { version: GAME_VERSION, expiresAt: 0 };
        }

        try { localStorage.setItem(storageKey, JSON.stringify(noticeState)); } catch (_) {}
        if (noticeState.expiresAt <= now) return;
    }

    if (noticeState.version !== GAME_VERSION)
    {
        noticeState = { version: GAME_VERSION, expiresAt: now + duration };
        try { localStorage.setItem(storageKey, JSON.stringify(noticeState)); } catch (_) {}
    }

    const remaining = Number(noticeState.expiresAt) - now;
    if (!Number.isFinite(remaining) || remaining <= 0) return;

    const header = document.querySelector(".sticky-top");
    const statusButton = document.getElementById("status-logbook-button");
    if (!header || !statusButton) return;

    const style = document.createElement("style");
    style.textContent = ".header-version-update{display:block;margin:8px auto 0;padding:10px 14px;max-width:100%;text-align:center;border:1px solid rgba(143,191,139,.55);border-radius:9px;background:rgba(38,83,43,.28);color:#c9efc5;font-size:.84rem;font-weight:800;letter-spacing:.02em;box-shadow:0 2px 12px rgba(0,0,0,.18)}";
    document.head.appendChild(style);

    const notice = document.createElement("div");
    notice.className = "header-version-update";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.setAttribute("data-i18n", "status.versionUpdateAvailable");
    notice.textContent = I18N.t("status.versionUpdateAvailable");

    const maintenanceLine = statusButton.nextElementSibling;
    if (maintenanceLine && maintenanceLine.classList.contains("header-maintenance-line"))
        maintenanceLine.insertAdjacentElement("afterend", notice);
    else
        statusButton.insertAdjacentElement("afterend", notice);

    window.setTimeout(() => notice.remove(), remaining);
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
