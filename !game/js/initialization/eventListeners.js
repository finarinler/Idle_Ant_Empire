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

    if (DOM.logResetBtn)
    {
        DOM.logResetBtn.onclick = clearLog;
    }

    if (DOM.gameResetBtn)
    {
        DOM.gameResetBtn.onclick = resetGame;
    }

    const saveGameButton = document.getElementById("save-game-btn");
    if (saveGameButton)
    {
        saveGameButton.addEventListener("click", () =>
        {
            saveGame();
            const original = saveGameButton.innerHTML;
            saveGameButton.textContent = "✓ " + I18N.tPlain("options.saved");
            saveGameButton.disabled = true;
            window.setTimeout(() =>
            {
                saveGameButton.innerHTML = original;
                saveGameButton.disabled = false;
            }, 1600);
        });
    }
}

