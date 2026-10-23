/* =========================
    Erfolge: Prüfen, freischalten, wiederherstellen
========================= */

// Jeden Tick aus updateResources() aufgerufen
function checkAchievements()
{
    ACHIEVEMENTS.forEach(checkAchievement);
}

function checkAchievement(definition)
{
    if (GameState.achievements[definition.id])
    {
        return;
    }

    const progress = definition.getProgress();

    if (progress.current >= progress.goal)
    {
        unlockAchievement(definition);
        return;
    }

    renderAchievementCard(
        definition.id,
        definition.title,
        definition.locked.description,
        ACHIEVEMENT_HIDDEN_REWARD,
        false,
        Math.min((progress.current / progress.goal) * 100, 100),
        progress.text || `${Math.floor(progress.current)}/${progress.goal}`
    );
}

function unlockAchievement(definition)
{
    GameState.achievements[definition.id] = true;

    addLogEntry(`Erfolg freigeschaltet: ${definition.title}`, "achievement");
    updateStatus(`Erfolg: ${definition.title}`, "success");
    triggerTrophy();
    triggerFlash();
    triggerConfetti(1000);

    renderUnlockedAchievement(definition);

    if (definition.onUnlock)
    {
        definition.onUnlock(false);
    }
}

function renderUnlockedAchievement(definition)
{
    renderAchievementCard(
        definition.id,
        definition.title,
        definition.unlocked.description,
        definition.unlocked.reward,
        true
    );
}

// Nach dem Laden: Karten und freigeschaltete Bereiche wiederherstellen (ohne Meldungen)
function rebuildAchievementsUI()
{
    ACHIEVEMENTS.forEach(definition =>
    {
        if (!GameState.achievements[definition.id])
        {
            return;
        }

        renderUnlockedAchievement(definition);

        if (definition.onUnlock)
        {
            definition.onUnlock(true);
        }
    });
}
