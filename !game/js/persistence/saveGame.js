/* =========================
    Speichern
    Speichert bewusst still: keine Statusmeldung, kein Logbuch-Eintrag
    (sonst würde z. B. das Expeditions-Ergebnis sofort überschrieben).

    Speicherformat (version 2): Ressourcen sind BigNum und werden als Text
    ("1.5e3", "Infinity", ...) gespeichert, damit nichts durch native Zahlen
    verloren geht. Version 1 (alte Spielstände) enthielt native Zahlen.
    Die Sprache wird NICHT im Spielstand, sondern separat gespeichert (i18n).
========================= */

const SAVE_VERSION = 2;

function serializeResources()
{
    const serialized = {};

    BIG_RESOURCE_KEYS.forEach(key =>
    {
        serialized[key] = GameState.resources[key].toString();
    });

    return serialized;
}

function saveGame()
{
    if (GameState.ui.isResetting)
    {
        return;
    }

    GameState.time.lastSaveTimestamp = Date.now();

    const saveData = {
        version: SAVE_VERSION,
        time: {
            ticks: GameState.time.ticks,
            lastSaveTimestamp: GameState.time.lastSaveTimestamp
        },
        resources: serializeResources(),
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
