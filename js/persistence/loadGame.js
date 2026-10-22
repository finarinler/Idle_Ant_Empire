/* =========================
    Laden
========================= */

/**
 * Übernimmt nur Werte, die im aktuellen GameState existieren und denselben Typ haben.
 * Alte / fehlende / kaputte Felder im Spielstand ändern dadurch nichts an den Standardwerten.
 */
function mergeSavedSection(target, saved)
{
    if (!saved || typeof saved !== "object")
    {
        return;
    }

    Object.keys(target).forEach(key =>
    {
        if (!(key in saved) || typeof saved[key] !== typeof target[key])
        {
            return;
        }

        if (typeof saved[key] === "number" && !Number.isFinite(saved[key]))
        {
            return;
        }

        target[key] = saved[key];
    });
}

function loadGame()
{
    const savedData = localStorage.getItem(CORE_CONFIG.SAVE_KEY);

    if (!savedData)
    {
        return;
    }

    try
    {
        const parsed = JSON.parse(savedData);

        if (!parsed || typeof parsed !== "object")
        {
            throw new Error("Ungültiges Speicherformat.");
        }

        mergeSavedSection(GameState.resources, parsed.resources);
        mergeSavedSection(GameState.structures, parsed.structures);
        mergeSavedSection(GameState.eliteUnits, parsed.eliteUnits);
        mergeSavedSection(GameState.stats, parsed.stats);
        mergeSavedSection(GameState.achievements, parsed.achievements);
        mergeSavedSection(GameState.expedition, parsed.expedition);
        mergeSavedSection(GameState.time, parsed.time);

        // Ohne gültigen Zeitstempel gibt es keinen Offline-Fortschritt
        if (!(GameState.time.lastSaveTimestamp > 0))
        {
            GameState.time.lastSaveTimestamp = 0;
        }

        rebuildAchievementsUI();
        updateStatus("Spielstand erfolgreich geladen.", "system");
    }
    catch (e)
    {
        console.error("Fehler beim Laden:", e);
        updateStatus("Spielstand konnte nicht geladen werden.", "warning");
    }
}
