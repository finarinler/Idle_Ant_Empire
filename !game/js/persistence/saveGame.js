/* =========================
    Speichern
    Speichert bewusst still: keine Statusmeldung, kein Logbuch-Eintrag.

    Speicherformat (version 3): Ressourcen sind BigNum und werden als Text gespeichert.
    Der Spielstand enthält den Reset-Marker (RESET_EPOCH) und die Spielversion.
    Die Sprache wird NICHT im Spielstand, sondern separat gespeichert (i18n).

    Zeitpunkte: Autosave alle 60 s (setzt sich bei JEDEM Speichern zurück, auch beim
    manuellen), pagehide/beforeunload als Sicherheitsnetz, Sonder-Save beim Abschluss
    automatischer Vorgänge von mindestens 60 s (siehe gameLoop.js).
========================= */

const SAVE_VERSION = 3;

function serializeResources()
{
    const serialized = {};

    BIG_RESOURCE_KEYS.forEach(key =>
    {
        serialized[key] = GameState.resources[key].toString();
    });

    return serialized;
}

function serializeEconomy()
{
    const eco = GameState.economy;
    const unmet = {};

    Object.keys(eco.unmet).forEach(key => { unmet[key] = eco.unmet[key].toString(); });

    return {
        broodExpertEnabled: eco.broodExpertEnabled !== false,
        deathTimers: Object.assign({}, eco.deathTimers),
        hatch: Object.assign({}, eco.hatch),
        trainings: Object.assign({}, eco.trainings || {}),
        trainingQueues: JSON.parse(JSON.stringify(eco.trainingQueues || {})),
        unmet
    };
}

function saveGame()
{
    if (GameState.ui.isResetting)
    {
        return;
    }

    // Wirtschaft bis zu diesem Moment fortschreiben, damit Bestand und Zeitstempel zusammenpassen
    Economy.update();

    GameState.time.lastSaveTimestamp = Date.now();

    const saveData = {
        version: SAVE_VERSION,
        resetEpoch: RESET_EPOCH,
        gameVersion: GAME_VERSION,
        time: {
            ticks: GameState.time.ticks,
            lastSaveTimestamp: GameState.time.lastSaveTimestamp
        },
        resources: serializeResources(),
        structures: GameState.structures,
        eliteUnits: GameState.eliteUnits,
        stats: GameState.stats,
        achievements: GameState.achievements,
        research: GameState.research,
        expedition: GameState.expedition,
        economy: serializeEconomy(),
        construction: GameState.construction
    };

    try
    {
        localStorage.setItem(CORE_CONFIG.SAVE_KEY, JSON.stringify(saveData));
    }
    catch (e)
    {
        console.error("Fehler beim Speichern:", e);
    }

    if (typeof restartAutosaveTimer === "function")
    {
        restartAutosaveTimer();
    }
}
