/* =========================
    UI Logic
========================= */

function toggleCategory(
    categoryId
)
{
    const wrapper = document.getElementById(
        `cat-${categoryId}`
    );

    if (wrapper)
    {
        wrapper.classList.toggle(
            "collapsed"
        );
    }
}

function unlockStructuresUI()
{
    if (DOM.catBasisStructures)
    {
        DOM.catBasisStructures.style.display = "block";

        DOM.catBasisStructures.classList.remove(
            "locked"
        );

        updateStatus(
            "Basis-Strukturen freigeschaltet!",
            "success"
        );
    }
}

function unlockEliteUI()
{
    if (DOM.catEliteUnits)
    {
        DOM.catEliteUnits.style.display = "block";

        DOM.catEliteUnits.classList.remove(
            "locked"
        );

        updateStatus(
            "Spezial-Einheiten freigeschaltet!",
            "success"
        );
    }
}

function updateStatus(
    message,
    type = "status",
    preventReset = false
)
{
    if (!DOM.statusText)
    {
        return;
    }

    DOM.statusText.textContent = message;

    addLogEntry(
        message,
        type
    );

    if (GameState.ui.statusTimeout)
    {
        clearTimeout(
            GameState.ui.statusTimeout
        );
    }

    if (!preventReset)
    {
        GameState.ui.statusTimeout = setTimeout(
            () => {
                DOM.statusText.textContent = GameState.ui.defaultStatus;
            },
            CORE_CONFIG.STATUS_RESET_MS
        );
    }
}

function toggleLog()
{
    if (!DOM.logContainer)
    {
        return;
    }

    if (DOM.legendContainer)
    {
        DOM.legendContainer.classList.add(
            "collapsed"
        );
    }

    if (DOM.achievementContainer)
    {
        DOM.achievementContainer.classList.add(
            "collapsed"
        );
    }

    DOM.logContainer.classList.toggle(
        "collapsed"
    );
}

function toggleLegend()
{
    if (!DOM.legendContainer)
    {
        return;
    }

    if (DOM.logContainer)
    {
        DOM.logContainer.classList.add(
            "collapsed"
        );
    }

    if (DOM.achievementContainer)
    {
        DOM.achievementContainer.classList.add(
            "collapsed"
        );
    }

    DOM.legendContainer.classList.toggle(
        "collapsed"
    );
}

function toggleAchievement()
{
    if (!DOM.achievementContainer)
    {
        return;
    }

    if (DOM.logContainer)
    {
        DOM.logContainer.classList.add(
            "collapsed"
        );
    }

    if (DOM.legendContainer)
    {
        DOM.legendContainer.classList.add(
            "collapsed"
        );
    }

    DOM.achievementContainer.classList.toggle(
        "collapsed"
    );
}

function addLogEntry(
    message,
    type = "status"
)
{
    if (!DOM.logContent)
    {
        return;
    }

    const entry = document.createElement(
        "div"
    );

    entry.classList.add(
        "log-entry"
    );

    const time = new Date().toLocaleTimeString(
        [],
        {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
    );

    let dotClass = "dot-status";

    let textClass = "log-status";

    if (type === "success")
    {
        dotClass = "dot-success";

        textClass = "log-success";
    }

    if (type === "achievement")
    {
        dotClass = "dot-achievement";

        textClass = "log-critical";
    }

    if (type === "warning")
    {
        dotClass = "dot-warning";

        textClass = "log-warning";
    }

    if (type === "system")
    {
        dotClass = "dot-system";

        textClass = "log-system";
    }

    entry.innerHTML = `<span class="log-time">[${time}]</span><span class="dot ${dotClass}"></span><span class="log-text ${textClass}">${message}</span>`;

    DOM.logContent.prepend(
        entry
    );

    if (DOM.logContent.children.length > CORE_CONFIG.MAX_LOG_ENTRIES)
    {
        DOM.logContent.removeChild(
            DOM.logContent.lastChild
        );
    }
}

function clearLog()
{
    if (DOM.logContent)
    {
        DOM.logContent.innerHTML = "";

        updateStatus(
            "Logbuch geleert.",
            "system"
        );
    }
}

function resetGame()
{
    if (
        confirm(
            "Möchtest du wirklich den gesamten Spielstand löschen? Dies kann nicht rückgängig gemacht werden!"
        )
    )
    {
        localStorage.removeItem(
            CORE_CONFIG.SAVE_KEY
        );

        location.reload();
    }
}

function triggerFlash()
{
    const flash = DOM.flashOverlay || document.getElementById(
        "flash-overlay"
    );

    if (flash)
    {
        flash.classList.add(
            "active"
        );

        setTimeout(
            () => {
                flash.classList.remove(
                    "active"
                );
            },
            500
        );
    }
}

function triggerTrophy()
{
    const trophy = DOM.trophyOverlay || document.getElementById(
        "achievement-trophy-overlay"
    );

    if (DOM.trophyOverlay)
    {
        DOM.trophyOverlay.classList.add(
            "show"
        );

        setTimeout(
            () => {
                DOM.trophyOverlay.classList.remove(
                    "show"
                );
            },
            3000
        );
    }
}