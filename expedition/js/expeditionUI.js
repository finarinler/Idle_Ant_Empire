/* =========================
    Expedition: Button & Fortschrittsbalken
    Zustand und Beschriftung des Buttons werden immer aus dem Spielzustand
    abgeleitet (updateExpeditionButtonState), nie aus einem eigenen UI-Flag.
========================= */

function updateExpeditionButtonState()
{
    const locked = isExpeditionButtonLocked();
    const running = GameState.expedition.isActive;

    if (DOM.expeditionBtn)
    {
        // Echte Sperre: ein deaktivierter Button löst keine Klicks aus
        DOM.expeditionBtn.disabled = locked;
        DOM.expeditionBtn.setAttribute("aria-disabled", String(locked));
        DOM.expeditionBtn.classList.toggle("scout-locked", hasScout());

        if (hasScout())
        {
            DOM.expeditionBtn.title = I18N.tPlain("expedition.scoutLockedTitle");
        }
        else
        {
            DOM.expeditionBtn.removeAttribute("title");
        }
    }

    if (DOM.expeditionText)
    {
        if (running)
        {
            I18N.setText(DOM.expeditionText, "expedition.running");
        }
        else
        {
            I18N.setText(DOM.expeditionText, "expedition.start", {
                seconds: getExpeditionDurationMs() / 1000
            });
        }

        DOM.expeditionText.classList.toggle("dot-animation", running);
    }
}

function setExpeditionRunningUI()
{
    updateExpeditionButtonState();
}

function setExpeditionIdleUI()
{
    if (DOM.expeditionProgress)
    {
        DOM.expeditionProgress.style.width = "0%";
    }

    updateExpeditionButtonState();
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
