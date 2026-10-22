/* =========================
    Statusleiste
========================= */

function setDefaultStatus()
{
    if (DOM.statusText)
    {
        DOM.statusText.textContent = GameState.ui.defaultStatus;
    }
}

function updateStatus(message, type = "status", preventReset = false)
{
    if (!DOM.statusText)
    {
        return;
    }

    DOM.statusText.textContent = message;

    // Gleiche Warnung direkt hintereinander (z. B. Hunger jede Sekunde)
    // nur einmal ins Logbuch schreiben, die Statuszeile bleibt aktuell.
    const isRepeatedWarning = type === "warning" && message === GameState.ui.lastLogMessage;

    if (!isRepeatedWarning)
    {
        addLogEntry(message, type);
    }

    GameState.ui.lastLogMessage = type === "warning" ? message : "";

    if (GameState.ui.statusTimeout)
    {
        clearTimeout(GameState.ui.statusTimeout);
    }

    if (!preventReset)
    {
        GameState.ui.statusTimeout = setTimeout(setDefaultStatus, CORE_CONFIG.STATUS_RESET_MS);
    }
}
