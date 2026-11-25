/* =========================
    Erfolge: Prüfen, freischalten, wiederherstellen
========================= */

function getAchievementTitleKey(id)
{
    return `achievement.${id}.title`;
}

// Jeden Tick aus updateResources() aufgerufen
function checkAchievements()
{
    ACHIEVEMENTS.forEach(checkAchievement);
}

function getAchievementProgressText(definition, progress, current, goal)
{
    if (progress.textKey)
    {
        return I18N.t(progress.textKey, progress.textParams);
    }

    return `${formatGameNumber(current)}/${formatGameNumber(goal)}`;
}

function checkAchievement(definition)
{
    if (GameState.achievements[definition.id])
    {
        return;
    }

    const progress = definition.getProgress();
    const current = Big(progress.current);
    const goal = Big(progress.goal);

    if (current.gte(goal))
    {
        unlockAchievement(definition);
        return;
    }

    const percent = goal.isPositive()
        ? Math.min(current.div(goal).mul(100).toNumber(), 100)
        : 0;

    renderAchievementCard(
        definition.id,
        {
            title: I18N.t(getAchievementTitleKey(definition.id)),
            desc: I18N.t(`achievement.${definition.id}.locked`, { goal }),
            rewardText: I18N.t(ACHIEVEMENT_HIDDEN_REWARD_KEY),
            progressText: getAchievementProgressText(definition, progress, current, goal)
        },
        false,
        percent
    );
}

function unlockAchievement(definition)
{
    // Doppelte Freischaltung ausschließen
    if (GameState.achievements[definition.id])
    {
        return;
    }

    GameState.achievements[definition.id] = true;

    // Die linke Navigation nach jeder Freischaltung aktualisieren
    // (z. B. Forschung nach knowledgeIsPower, Erfolge nach firstSteps).
    if (typeof updateGameNavigationVisibility === "function")
    {
        updateGameNavigationVisibility();
    }

    if (definition.id === "knowledgeIsPower" && typeof updateResearchButtonVisibility === "function")
    {
        updateResearchButtonVisibility();
    }

    const params = { title: { key: getAchievementTitleKey(definition.id) } };

    addLogEntry("log.achievementUnlocked", "achievement", params);
    updateStatus("status.achievementUnlocked", "success", false, params);
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
    const goal = Big(definition.getProgress().goal);

    renderAchievementCard(
        definition.id,
        {
            title: I18N.t(getAchievementTitleKey(definition.id)),
            desc: I18N.t(`achievement.${definition.id}.unlocked`, { goal }),
            rewardText: I18N.t(`achievement.${definition.id}.reward`),
            progressText: ""
        },
        true
    );
}

// Zeichnet alle freigeschalteten Karten neu (ohne onUnlock), z. B. nach einem Sprachwechsel
function renderUnlockedAchievements()
{
    ACHIEVEMENTS.forEach(definition =>
    {
        if (GameState.achievements[definition.id])
        {
            renderUnlockedAchievement(definition);
        }
    });
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

    if (typeof updateResearchButtonVisibility === "function")
    {
        updateResearchButtonVisibility();
    }
    else if (typeof updateGameNavigationVisibility === "function")
    {
        updateGameNavigationVisibility();
    }
}
