/* =========================
    Expedition: Button & Fortschrittsbalken
========================= */

function setExpeditionRunningUI()
{
    if (DOM.expeditionBtn)
    {
        DOM.expeditionBtn.disabled = true;
    }

    if (DOM.expeditionText)
    {
        DOM.expeditionText.textContent = "Auf Expedition";
        DOM.expeditionText.classList.add("dot-animation");
    }
}

function setExpeditionIdleUI()
{
    if (DOM.expeditionBtn)
    {
        DOM.expeditionBtn.disabled = false;
    }

    if (DOM.expeditionProgress)
    {
        DOM.expeditionProgress.style.width = "0%";
    }

    if (DOM.expeditionText)
    {
        const seconds = getExpeditionDurationMs() / 1000;
        DOM.expeditionText.textContent = `Auf Expedition gehen (${seconds}s)`;
        DOM.expeditionText.classList.remove("dot-animation");
    }
}

function updateExpeditionProgressUI(progress)
{
    if (DOM.expeditionProgress)
    {
        DOM.expeditionProgress.style.width = `${progress}%`;
    }
}

/**
 * Beim Spielstart: laufende Expedition fortsetzen oder Button im Ruhezustand zeigen.
 */
function restoreExpeditionUI()
{
    if (GameState.expedition.isActive)
    {
        setExpeditionRunningUI();
        updateExpeditionProgressUI(GameState.expedition.progress);
    }
    else
    {
        setExpeditionIdleUI();
    }
}
