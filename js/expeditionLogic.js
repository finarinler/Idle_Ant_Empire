/* =========================
    Expedition Logic
========================= */
function getNormalReward()
{
    const roll = Math.random() * 100;
    if (roll < 5)
    {
        return 10;
    }
    if (roll < 11)
    {
        return 9;
    }
    if (roll < 18)
    {
        return 8;
    }
    if (roll < 26)
    {
        return 7;
    }
    if (roll < 35)
    {
        return 6;
    }
    if (roll < 46)
    {
        return 5;
    }
    if (roll < 58)
    {
        return 4;
    }
    if (roll < 71)
    {
        return 3;
    }
    if (roll < 85)
    {
        return 2;
    }
    return 1;
}

function getCriticalReward()
{
    const roll = Math.random() * 100;
    if (roll < 4)
    {
        return 25;
    }
    if (roll < 9)
    {
        return 24;
    }
    if (roll < 15)
    {
        return 23;
    }
    if (roll < 22)
    {
        return 22;
    }
    if (roll < 30)
    {
        return 21;
    }
    if (roll < 39)
    {
        return 20;
    }
    if (roll < 49)
    {
        return 19;
    }
    if (roll < 60)
    {
        return 18;
    }
    if (roll < 72)
    {
        return 17;
    }
    if (roll < 85)
    {
        return 16;
    }
    return 15;
}

function startExpedition()
{
    if (GameState.expedition.isActive)
    {
        return;
    }
    GameState.expedition.isActive = true;
    GameState.expedition.startTime = Date.now();
    if (DOM.expeditionBtn)
    {
        DOM.expeditionBtn.disabled = true;
    }
    if (DOM.expeditionText)
    {
        DOM.expeditionText.textContent = "Auf Expedition";
        DOM.expeditionText.classList.add(
            "dot-animation"
        );
    }
    updateStatus(
        "Deine Kolonie ist auf Expedition",
        "status",
        true
    );
}

function updateExpedition()
{
    if (!GameState.expedition.isActive)
    {
        return;
    }
    const elapsed = Date.now() - GameState.expedition.startTime;
    const progress = Math.min(
        (elapsed / CORE_CONFIG.EXPEDITION_DURATION_MS) * 100,
        100
    );
    GameState.expedition.progress = progress;
    if (DOM.expeditionProgress)
    {
        DOM.expeditionProgress.style.width = `${progress}%`;
    }
    if (elapsed >= CORE_CONFIG.EXPEDITION_DURATION_MS)
    {
        completeExpedition();
    }
}

function completeExpedition()
{
    GameState.expedition.isActive = false;
    GameState.expedition.progress = 0;
    GameState.stats.expeditionsCount++;
    const findRoll = Math.random() * 100;
    if (findRoll < 95)
    {
        const criticalRoll = Math.random() * 100;
        if (criticalRoll < 5)
        {
            const amount = getCriticalReward();
            GameState.resources.food += amount;
            triggerFlash();
            triggerConfetti(
                500
            );
            updateStatus(
                `Expedition sehr erfolgreich: ${amount} Nahrung gefunden.`,
                "success"
            );
        }
        else
        {
            const amount = getNormalReward();
            GameState.resources.food += amount;
            updateStatus(
                `Expedition erfolgreich: ${amount} Nahrung gefunden.`,
                "success"
            );
        }
    }
    else
    {
        updateStatus(
            "Expedition erfolglos: Nichts gefunden.",
            "warning"
        );
    }
    if (GameState.achievements.smallCollector && Math.random() * 100 < 5)
    {
        GameState.resources.antsFound++;
        updateStatus(
            "Eine verirrte Ameise hat sich deiner Kolonie angeschlossen!",
            "success"
        );
    }
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
        DOM.expeditionText.textContent = "Auf Expedition gehen (10s)";
        DOM.expeditionText.classList.remove(
            "dot-animation"
        );
    }
    checkAchievements();
}