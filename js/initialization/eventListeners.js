/* =========================
    Event Listener
    Kauf-Buttons von Einheiten und Strukturen werden in deren eigenen Dateien gebunden.
========================= */

function attachEventListeners()
{
    if (DOM.expeditionBtn)
    {
        DOM.expeditionBtn.onclick = handleExpeditionButtonClick;
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
