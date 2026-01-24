/* =========================
    Persistence Logic
========================= */

function saveGame()
{
    const saveData = JSON.stringify(
        GameState
    );

    localStorage.setItem(
        CORE_CONFIG.SAVE_KEY,
        saveData
    );

    updateStatus(
        "Spielstand automatisch gespeichert.",
        "system"
    );
}

function loadGame()
{
    const savedData = localStorage.getItem(
        CORE_CONFIG.SAVE_KEY
    );

    if (!savedData)
    {
        return;
    }

    try
    {
        const parsed = JSON.parse(
            savedData
        );

        Object.assign(
            GameState.resources,
            parsed.resources
        );

        if (parsed.structures)
        {
            Object.assign(
                GameState.structures,
                parsed.structures
            );
        }

        Object.assign(
            GameState.stats,
            parsed.stats
        );

        Object.assign(
            GameState.achievements,
            parsed.achievements
        );

        GameState.time.ticks = parsed.time.ticks;

        rebuildAchievementsUI();

        updateStatus(
            "Spielstand erfolgreich geladen.",
            "system"
        );
    }
    catch (e)
    {
        console.error(
            "Fehler beim Laden:",
            e
        );
    }
}

function rebuildAchievementsUI()
{
    if (GameState.achievements.firstSteps)
    {
        if (DOM.achievementToggleBtn)
        {
            DOM.achievementToggleBtn.disabled = false;

            DOM.achievementToggleBtn.title = "Erfolge";
        }

        renderAchievementCard(
            "firstSteps",
            "Erste Schritte",
            "5 Expeditionen abgeschlossen",
            "Belohnung: Erfolgsmenü freigeschaltet",
            true
        );
    }

    if (GameState.achievements.smallCollector)
    {
        renderAchievementCard(
            "smallCollector",
            "Kleiner Sammler",
            "300 Nahrung gesammelt",
            "Belohnung: Chance eine verirrte Ameise zu finden",
            true
        );
    }

    if (GameState.achievements.smallColony)
    {
        renderAchievementCard(
            "smallColony",
            "Kleiner Ameisenstaat",
            "10 Königinnen gekauft",
            "Belohnung: Basis-Strukturen freigeschaltet",
            true
        );

        unlockStructuresUI();
    }

    if (GameState.achievements.buildColony)
    {
        renderAchievementCard(
            "buildColony",
            "Bau der Kolonie",
            "Vorratskammer und Brutkammer errichtet",
            "Belohnung: Spezialeinheiten freigeschaltet",
            true
        );

        unlockEliteUI();
    }
}