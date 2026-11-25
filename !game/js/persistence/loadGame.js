/* =========================
    Laden
    Spielstände ohne den aktuellen Reset-Marker (RESET_EPOCH) werden beim ersten Start
    dieser Version vollständig gelöscht (kein Backup, keine Migration).
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

function loadSavedEconomy(saved)
{
    if (!saved || typeof saved !== "object")
    {
        return;
    }

    const eco = GameState.economy;

    if (saved.deathTimers && typeof saved.deathTimers === "object")
    {
        UnitRegistry.all().forEach(def =>
        {
            const value = saved.deathTimers[def.id];

            if (typeof value === "number" && Number.isFinite(value) && value >= 0)
            {
                eco.deathTimers[def.id] = Math.min(value, CORE_CONFIG.DEATH_TIMER_SECONDS);
            }
        });
    }

    const hatch = saved.hatch;

    if (hatch && hatch.active === true
        && Number.isFinite(hatch.remaining) && hatch.remaining >= 0
        && Number.isFinite(hatch.duration) && hatch.duration > 0)
    {
        eco.hatch = { active: true, remaining: Math.min(hatch.remaining, hatch.duration), duration: hatch.duration };
    }

    if (saved.unmet && typeof saved.unmet === "object")
    {
        Object.keys(eco.unmet).forEach(key =>
        {
            const value = BigNum.tryFrom(saved.unmet[key]);

            if (value !== null && !value.isNegative()) { eco.unmet[key] = value; }
        });
    }
}

function loadSavedConstruction(saved)
{
    if (!saved || typeof saved !== "object")
    {
        return;
    }

    ["free", "builder"].forEach(slot =>
    {
        const project = saved[slot];

        if (!project || typeof project !== "object" || !StructureRegistry.has(project.structureId)) { return; }
        if (project.kind !== "build" && project.kind !== "upgrade") { return; }
        if (!Number.isFinite(project.duration) || project.duration <= 0) { return; }
        if (!Number.isFinite(project.remaining) || project.remaining < 0) { return; }

        GameState.construction[slot] = {
            structureId: project.structureId,
            kind: project.kind,
            targetLevel: Number.isFinite(project.targetLevel) ? Math.floor(project.targetLevel) : 0,
            duration: project.duration,
            remaining: Math.min(project.remaining, project.duration)
        };
    });
}

// Hält den geladenen Zustand in sich konsistent
function sanitizeLoadedState()
{
    const state = GameState;
    const structures = state.structures;

    ["storageCount", "nurseryCount", "housingCount", "mushroomFarmCount", "housingLevel", "constructionLevel"]
        .forEach(key => { structures[key] = Math.floor(structures[key]); });

    structures.hasStorage = structures.storageCount > 0;
    structures.hasNursery = structures.nurseryCount > 0;
    structures.housingCount = Math.max(1, structures.housingCount);
    structures.housingLevel = Math.max(1, Math.min(BALANCE.housing.maxLevel, structures.housingLevel));
    structures.constructionLevel = Math.min(BALANCE.builder.maxBuilders, structures.constructionLevel);

    Object.keys(state.eliteUnits).forEach(key => { state.eliteUnits[key] = Math.floor(state.eliteUnits[key]); });
    state.eliteUnits.scoutCount = Math.min(state.eliteUnits.scoutCount, BALANCE.carriedOver.scout.maxCount);

    const expedition = state.expedition;

    expedition.progress = Math.min(expedition.progress, 100);

    if (!expedition.isActive)
    {
        expedition.progress = 0;
        expedition.startTime = 0;
    }

    // Eine manipulierte / in der Zukunft liegende Erholungszeit darf den Späher nie dauerhaft blockieren
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

// Löscht den Spielstand samt aller (früheren) Backup-Schlüssel vollständig
function wipeAllSaveData()
{
    try
    {
        localStorage.removeItem(CORE_CONFIG.SAVE_KEY);
        localStorage.removeItem(SAVE_BACKUP_KEY_V1);
        localStorage.removeItem(SAVE_BACKUP_KEY_CORRUPT);
    }
    catch (e)
    {
        console.warn("Spielstand konnte nicht gelöscht werden:", e);
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

    // Ein früherer Backup-Schlüssel darf nach dem Reset nirgends erhalten bleiben
    try
    {
        if (savedData === null || !savedData.includes(`"resetEpoch":"${RESET_EPOCH}"`))
        {
            localStorage.removeItem(SAVE_BACKUP_KEY_V1);
            localStorage.removeItem(SAVE_BACKUP_KEY_CORRUPT);
        }
    }
    catch (e) { /* ignorieren */ }

    if (!savedData)
    {
        return;
    }

    let parsed = null;

    try
    {
        parsed = JSON.parse(savedData);
    }
    catch (e)
    {
        // Beschädigter Spielstand: nur sichern, wenn er zur aktuellen Version gehört
        if (savedData.includes(`"resetEpoch":"${RESET_EPOCH}"`))
        {
            console.error("Fehler beim Laden:", e);
            backupRawSave(SAVE_BACKUP_KEY_CORRUPT, savedData);
            updateStatus("status.loadFailed", "warning");
        }
        else
        {
            wipeAllSaveData();
            updateStatus("status.versionReset", "system", true);
        }

        return;
    }

    // Einmaliger Reset: anderer / fehlender Marker = vollständiger Neustart
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || parsed.resetEpoch !== RESET_EPOCH)
    {
        wipeAllSaveData();
        updateStatus("status.versionReset", "system", true);
        return;
    }

    try
    {
        loadSavedResources(parsed.resources);
        mergeSavedSection(GameState.structures, parsed.structures);
        mergeSavedSection(GameState.eliteUnits, parsed.eliteUnits);
        mergeSavedSection(GameState.stats, parsed.stats);
        mergeSavedSection(GameState.achievements, parsed.achievements);
        mergeSavedSection(GameState.expedition, parsed.expedition);
        mergeSavedSection(GameState.time, parsed.time);
        loadSavedEconomy(parsed.economy);
        loadSavedConstruction(parsed.construction);

        sanitizeLoadedState();

        rebuildAchievementsUI();
        updateStatus("status.loadSuccess", "system");
    }
    catch (e)
    {
        console.error("Fehler beim Laden:", e);
        backupRawSave(SAVE_BACKUP_KEY_CORRUPT, savedData);
        updateStatus("status.loadFailed", "warning");
    }
}
