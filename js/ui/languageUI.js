/* =========================
    Sprachwechsel im Spiel
    Aktualisiert nach einem Sprachwechsel alle dynamischen Texte
    ohne Neuladen. Der Spielzustand wird dabei nicht verändert.
========================= */

function refreshAchievementButtonTitle()
{
    if (!DOM.achievementToggleBtn)
    {
        return;
    }

    DOM.achievementToggleBtn.title = I18N.tPlain(
        GameState.achievements.firstSteps ? "ui.achievements" : "ui.achievementsLocked"
    );
}

// Zeichnet alles neu, was nicht über data-i18n im HTML steht
function refreshLanguageDependentUI()
{
    renderStatus();
    renderLog();
    renderUnlockedAchievements();
    refreshAchievementButtonTitle();

    // Einheiten, Kosten, Expeditionsbutton und Erfolgskarten werden neu gezeichnet
    updateResources();
}

// Die Sprachauswahl selbst liegt im Options-Menü (js/ui/optionsMenu.js);
// hier wird nur dafür gesorgt, dass nach einem Wechsel alle dynamischen Texte neu gezeichnet werden.
function initLanguageUI()
{
    I18N.onChange(refreshLanguageDependentUI);
}
