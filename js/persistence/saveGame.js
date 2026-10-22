/* =========================
    Speichern
    Speichert bewusst still: keine Statusmeldung, kein Logbuch-Eintrag
    (sonst würde z. B. das Expeditions-Ergebnis sofort überschrieben).
========================= */

function saveGame()
{
    if (GameState.ui.isResetting)
    {
        return;
    }

    GameState.time.lastSaveTimestamp = Date.now();

    const saveData = {
        time: {
            ticks: GameState.time.ticks,
            lastSaveTimestamp: GameState.time.lastSaveTimestamp
        },
        resources: GameState.resources,
        structures: GameState.structures,
        eliteUnits: GameState.eliteUnits,
        stats: GameState.stats,
        achievements: GameState.achievements,
        expedition: GameState.expedition
    };

    try
    {
        localStorage.setItem(CORE_CONFIG.SAVE_KEY, JSON.stringify(saveData));
    }
    catch (e)
    {
        console.error("Fehler beim Speichern:", e);
    }
}
