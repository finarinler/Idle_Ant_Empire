/* =========================
    Laden (inkl. Migration älterer Spielstände)
========================= */

const SAVE_BACKUP_KEY_V1 = "ant_empire_save_backup_v1";
const SAVE_BACKUP_KEY_CORRUPT = "ant_empire_save_corrupt";

/**
 * Übernimmt nur Werte, die im aktuellen GameState existieren und denselben Typ haben.
 * Alte / fehlende / kaputte Felder im Spielstand ändern dadurch nichts an den Standardwerten.
 * Zahlen müssen endlich und nicht negativ sein.
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

        if (typeof saved[key] === "number" && (!Number.isFinite(saved[key]) || saved[key] < 0))
        {
            return;
        }

        target[key] = saved[key];
    });
}

/**
 * Liest die Ressourcen. Akzeptiert alte Spielstände (native Zahlen) und das
 * neue Format (Text). Ungültige oder negative Werte lassen den Standardwert stehen.
 */
function loadSavedResources(saved)
{
    if (!saved || typeof saved !== "object")
    {
        return;
    }

    BIG_RESOURCE_KEYS.forEach(key =>
    {
        if (!(key in saved))
        {
            return;
        }

        const value = BigNum.tryFrom(saved[key]);

        if (value === null || value.isNegative())
        {
            console.warn(`[Laden] Ungültiger Wert für Ressource "${key}" wird ignoriert:`, saved[key]);
            return;
        }

        GameState.resources[key] = value;
    });
}

// Hält den geladenen Zustand in sich konsistent
function sanitizeLoadedState()
{
    const state = GameState;

    state.structures.hasStorage = state.structures.storageCount > 0;
    state.structures.hasNursery = state.structures.nurseryCount > 0;

    state.eliteUnits.scoutCount = Math.min(
        Math.floor(state.eliteUnits.scoutCount),
        typeof SCOUT_CONFIG !== "undefined" ? SCOUT_CONFIG.maxCount : 1
    );

    const expedition = state.expedition;

    expedition.progress = Math.min(expedition.progress, 100);

    if (!expedition.isActive)
    {
        expedition.progress = 0;
        expedition.startTime = 0;
    }

    // Eine manipulierte / in der Zukunft liegende Erholungszeit darf die Kundschafterin nie dauerhaft blockieren
    const latestRest = Date.now() + CORE_CONFIG.SCOUT_REST_MS;

    if (expedition.scoutRestUntil > latestRest)
    {
        expedition.scoutRestUntil = latestRest;
    }

    // Ohne gültigen Zeitstempel gibt es keinen Offline-Fortschritt
    if (!(state.time.lastSaveTimestamp > 0))
    {
        state.time.lastSaveTimestamp = 0;
    }
}

function backupRawSave(key, raw)
{
    try
    {
        // Ein bereits vorhandenes Backup nicht überschreiben
        if (localStorage.getItem(key) === null)
        {
            localStorage.setItem(key, raw);
        }
    }
    catch (e)
    {
        console.warn("Backup des Spielstands nicht möglich:", e);
    }
}

function loadGame()
{
    let savedData = null;

    try
    {
        savedData = localStorage.getItem(CORE_CONFIG.SAVE_KEY);
    }
    catch (e)
    {
        console.error("Spielstand nicht lesbar:", e);
        return;
    }

    if (!savedData)
    {
        return;
    }

    try
    {
        const parsed = JSON.parse(savedData);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        {
            throw new Error(I18N.t("error.invalidSaveFormat"));
        }

        // Spielstand ohne Versionsnummer = Format 1 (native Zahlen)
        const migrated = !(parsed.version >= SAVE_VERSION);

        if (migrated)
        {
            // Vor dem ersten Überschreiben im neuen Format den alten Spielstand sichern
            backupRawSave(SAVE_BACKUP_KEY_V1, savedData);
        }

        loadSavedResources(parsed.resources);
        mergeSavedSection(GameState.structures, parsed.structures);
        mergeSavedSection(GameState.eliteUnits, parsed.eliteUnits);
        mergeSavedSection(GameState.stats, parsed.stats);
        mergeSavedSection(GameState.achievements, parsed.achievements);
        mergeSavedSection(GameState.expedition, parsed.expedition);
        mergeSavedSection(GameState.time, parsed.time);

        sanitizeLoadedState();

        rebuildAchievementsUI();
        updateStatus("status.loadSuccess", "system");

        if (migrated)
        {
            updateStatus("status.loadMigrated", "system");
        }
    }
    catch (e)
    {
        console.error("Fehler beim Laden:", e);
        backupRawSave(SAVE_BACKUP_KEY_CORRUPT, savedData);
        updateStatus("status.loadFailed", "warning");
    }
}
