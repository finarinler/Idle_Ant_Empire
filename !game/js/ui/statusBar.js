/* =========================
    Statusleiste
    Die aktuelle Meldung wird als { key, params } gehalten und bei
    einem Sprachwechsel neu übersetzt.
========================= */

function renderStatus()
{
    if (!DOM.statusText)
    {
        return;
    }

    // Die Statusvorschau wird ausschließlich aus dem Logbuch aufgebaut.
    // So überschreibt ein zurückgesetzter Idle-Status keine älteren Meldungen.
    if (typeof renderStatusPreview === "function")
    {
        renderStatusPreview();
    }
}

function setDefaultStatus()
{
    GameState.ui.status = { key: "status.default", params: null, timestamp: new Date() };
    // Der neutrale Wartezustand ist nur eine Statusanzeige und kein Logereignis.
    // Vorhandene Logeinträge bleiben in der Vorschau sichtbar.
    renderStatus();
}

/**
 * @param {string} key           Übersetzungsschlüssel der Meldung
 * @param {string} type          status | success | achievement | warning | system
 * @param {boolean} preventReset true: Meldung bleibt stehen (kein Zurücksetzen auf den Standardtext)
 * @param {Object} params        Platzhalter für die Übersetzung
 */
function updateStatus(key, type = "status", preventReset = false, params = null)
{
    if (!DOM.statusText)
    {
        return;
    }

    GameState.ui.status = { key, params, timestamp: new Date() };
    renderStatus();

    // Gleiche Warnung direkt hintereinander (z. B. Hunger jede Sekunde)
    // nur einmal ins Logbuch schreiben, die Statuszeile bleibt aktuell.
    const signature = key + "\u0000" + JSON.stringify(params);
    const isRepeatedWarning = type === "warning" && signature === GameState.ui.lastLogMessage;

    // Startmeldungen laufender Vorgänge gehören in die Statusleiste,
    // aber nicht als dauerhaftes Ereignis ins Logbuch.
    const transientStatusKeys = [
        "status.expeditionStarted",
        "status.build.started",
        "status.unit.trainingStarted"
    ];
    const isTransientStatus = transientStatusKeys.includes(key);

    if (!isRepeatedWarning && !isTransientStatus)
    {
        addLogEntry(key, type, params);
    }

    GameState.ui.lastLogMessage = type === "warning" ? signature : "";

    if (GameState.ui.statusTimeout)
    {
        clearTimeout(GameState.ui.statusTimeout);
        GameState.ui.statusTimeout = null;
    }

    if (!preventReset)
    {
        GameState.ui.statusTimeout = setTimeout(setDefaultStatus, CORE_CONFIG.STATUS_RESET_MS);
    }
}
