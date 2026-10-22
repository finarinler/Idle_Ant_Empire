/* =========================
    Logbuch
========================= */

const LOG_STYLES = {
    status:      { dot: "dot-status",      text: "log-status" },
    success:     { dot: "dot-success",     text: "log-success" },
    achievement: { dot: "dot-achievement", text: "log-critical" },
    warning:     { dot: "dot-warning",     text: "log-warning" },
    system:      { dot: "dot-system",      text: "log-system" }
};

function addLogEntry(message, type = "status")
{
    if (!DOM.logContent)
    {
        return;
    }

    const style = LOG_STYLES[type] || LOG_STYLES.status;

    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const entry = document.createElement("div");
    entry.classList.add("log-entry");
    entry.innerHTML =
        `<span class="log-time">[${time}]</span>` +
        `<span class="dot ${style.dot}"></span>` +
        `<span class="log-text ${style.text}">${message}</span>`;

    DOM.logContent.prepend(entry);

    if (DOM.logContent.children.length > CORE_CONFIG.MAX_LOG_ENTRIES)
    {
        DOM.logContent.removeChild(DOM.logContent.lastChild);
    }
}

function clearLog()
{
    if (DOM.logContent)
    {
        DOM.logContent.innerHTML = "";
        updateStatus("Logbuch geleert.", "system");
    }
}
