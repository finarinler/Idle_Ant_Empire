/* =========================
    Logbuch
    Einträge werden als Daten ({ Zeit, Typ, Schlüssel, Parameter }) gehalten und beim
    Sprachwechsel neu gezeichnet, damit auch ältere Einträge die gewählte Sprache zeigen.
========================= */

const LOG_STYLES = {
    status:      { dot: "dot-status",      text: "log-status" },
    success:     { dot: "dot-success",     text: "log-success" },
    achievement: { dot: "dot-achievement", text: "log-critical" },
    warning:     { dot: "dot-warning",     text: "log-warning" },
    system:      { dot: "dot-system",      text: "log-system" }
};

// Neueste Einträge zuerst
const logEntries = [];

function buildLogEntryElement(entry)
{
    const style = LOG_STYLES[entry.type] || LOG_STYLES.status;

    const time = entry.timestamp.toLocaleTimeString(I18N.getLanguageInfo().localeTag, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const element = document.createElement("div");
    element.classList.add("log-entry");

    const timeSpan = document.createElement("span");
    timeSpan.className = "log-time";
    timeSpan.textContent = `[${time}]`;

    const dot = document.createElement("span");
    dot.className = `dot ${style.dot}`;

    const text = document.createElement("span");
    text.className = `log-text ${style.text}`;
    if (entry.maintenanceRaw) text.style.fontWeight = "800";
    text.textContent = I18N.t(entry.key, entry.params);

    element.append(timeSpan, dot, text);

    return element;
}

/**
 * @param {string} key     Übersetzungsschlüssel der Meldung
 * @param {string} type    status | success | achievement | warning | system
 * @param {Object} params  Platzhalter für die Übersetzung
 */
function addLogEntry(key, type = "status", params = null)
{
    if (!DOM.logContent)
    {
        return;
    }

    const entry = { timestamp: new Date(), type, key, params };

    logEntries.unshift(entry);
    const emptyState = DOM.logContent.querySelector(".logbook-empty-state");
    if (emptyState) emptyState.remove();
    DOM.logContent.prepend(buildLogEntryElement(entry));

    while (logEntries.length > CORE_CONFIG.MAX_LOG_ENTRIES)
    {
        logEntries.pop();

        if (DOM.logContent.lastChild)
        {
            DOM.logContent.removeChild(DOM.logContent.lastChild);
        }
    }
}

// Zeichnet das gesamte Logbuch neu (z. B. nach einem Sprachwechsel)
function renderLog()
{
    if (!DOM.logContent)
    {
        return;
    }

    DOM.logContent.replaceChildren(...logEntries.map(buildLogEntryElement));
    if (logEntries.length === 0) {
        const empty = document.createElement("div");
        empty.className = "logbook-empty-state";
        empty.dataset.i18n = "logbook.empty";
        empty.textContent = I18N.tPlain("logbook.empty");
        DOM.logContent.appendChild(empty);
    }
}

function clearLog()
{
    if (DOM.logContent)
    {
        logEntries.length = 0;
        DOM.logContent.replaceChildren();
        updateStatus("status.logCleared", "system");
    }
}


// Ist das Logbuch schon im DOM verdrahtet? (Wartungswarnungen warten sonst, statt verloren zu gehen.)
function isLogReady()
{
    return typeof DOM !== "undefined" && !!DOM && !!DOM.logContent;
}

// Wartungswarnungen: fett, als Schlüssel + Parameter gespeichert, damit sie beim Sprachwechsel
// (renderLog) in der neuen Sprache neu gezeichnet werden.
function addMaintenanceLogEntry(key, params = null)
{
    if (!DOM.logContent) return;
    const entry = { timestamp: new Date(), type: "warning", key, params, maintenanceRaw: true };
    logEntries.unshift(entry);
    const emptyState = DOM.logContent.querySelector(".logbook-empty-state");
    if (emptyState) emptyState.remove();
    DOM.logContent.prepend(buildLogEntryElement(entry));
    while (logEntries.length > CORE_CONFIG.MAX_LOG_ENTRIES) { logEntries.pop(); if (DOM.logContent.lastChild) DOM.logContent.removeChild(DOM.logContent.lastChild); }
}
