/* =========================
    Erfolge: Prüfen, freischalten, wiederherstellen
========================= */

function getAchievementTitleKey(id)
{
    return `achievement.${id}.title`;
}

function grantAchievementPoints(points)
{
    const amount = Math.max(0, Math.floor(Number(points) || 0));
    if (amount > 0)
    {
        GameState.stats.currentAchievementPoints =
            (Number(GameState.stats.currentAchievementPoints) || 0) + amount;
        GameState.stats.totalAchievementPointsEarned =
            (Number(GameState.stats.totalAchievementPointsEarned) || 0) + amount;
    }

    updateAchievementPointsDisplay();
    if (typeof updateStatistics === "function") updateStatistics();
}

function updateAchievementPointsDisplay()
{
    const current = Math.max(0, Number(GameState.stats.currentAchievementPoints) || 0);
    const total = Math.max(0, Number(GameState.stats.totalAchievementPointsEarned) || 0);
    const currentNode = document.getElementById("achievement-points-current");
    const totalNode = document.getElementById("achievement-points-total");
    if (currentNode) currentNode.textContent = formatGameNumber(current);
    if (totalNode) totalNode.textContent = formatGameNumber(total);
}

let achievementPointsLocaleListenerRegistered = false;

function initializeAchievementPointsForExistingAchievements()
{
    if (!achievementPointsLocaleListenerRegistered
        && typeof I18N !== "undefined"
        && typeof I18N.onChange === "function")
    {
        I18N.onChange(updateAchievementPointsDisplay);
        achievementPointsLocaleListenerRegistered = true;
    }

    const stats = GameState.stats;

    // Die Nachvergütung ist eine einmalige Migration. Das Flag ist maßgeblich:
    // Auch ein gültiger Gesamtstand von 0 darf beim Neuladen nicht erneut
    // als Anlass für eine Nachvergütung bereits freigeschalteter Erfolge dienen.
    if (stats.achievementPointsInitialized === true)
    {
        updateAchievementPointsDisplay();
        return;
    }

    let retroactivePoints = 0;
    ACHIEVEMENTS.forEach(definition =>
    {
        if (GameState.achievements[definition.id])
        {
            retroactivePoints += Math.max(0, Number(definition.epReward) || 0);
        }
    });

    stats.currentAchievementPoints =
        (Number(stats.currentAchievementPoints) || 0) + retroactivePoints;
    stats.totalAchievementPointsEarned =
        (Number(stats.totalAchievementPointsEarned) || 0) + retroactivePoints;
    stats.achievementPointsInitialized = true;

    updateAchievementPointsDisplay();
    if (typeof updateStatistics === "function") updateStatistics();
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
    grantAchievementPoints(definition.epReward);

    // Forschungsabhängige Gebäudekarten sofort nach der Freischaltung einblenden.
    if (typeof CardBuilder !== "undefined")
    {
        CardBuilder.updateAll();
    }

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
            rewardText: I18N.t(`achievement.${definition.id}.reward`) + (definition.epReward > 0 ? " · " + I18N.t("achievementPoints.reward", { points: definition.epReward }) : ""),
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
    updateAchievementPointsDisplay();
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
