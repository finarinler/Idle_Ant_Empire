/* =========================
    Elite-Einheiten mit Lagerwirkung
    Vorrats-Hüterin verdoppelt das Nahrungslager,
    Groß-Amme verdoppelt das Larvenlager (siehe core/capacity.js).
    Die Brut-Expertin hat einen eigenen Produktionszyklus (broodExpert.js).
    Darstellung: unitCatalog.js
========================= */

/* ---------- Voraussetzungen ---------- */

function hasEliteRequirements()
{
    return GameState.structures.storageCount > 0
        && GameState.structures.nurseryCount > 0;
}

/* ---------- Konfiguration ---------- */

const STORAGE_GUARDIAN_CONFIG = {
    cost: { ants: 150, food: 7500, larvae: 2000, queens: 1 },
    costMultiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
    upkeep: 1,
    maxCount: 5
};

const GRAND_NURSE_CONFIG = {
    cost: { ants: 200, food: 7500, larvae: 2000, queens: 1 },
    costMultiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
    upkeep: 1,
    maxCount: 5
};

/* ---------- Gemeinsame Kauflogik ---------- */

/**
 * @param {Object} config   Konfiguration mit cost, costMultiplier, maxCount
 * @param {string} stateKey Zähler in GameState.eliteUnits
 * @param {string} trainedStatus Übersetzungsschlüssel der Erfolgsmeldung
 */
function buyEliteUnit(config, stateKey, trainedStatus)
{
    const count = GameState.eliteUnits[stateKey] || 0;

    if (!hasEliteRequirements())
    {
        updateStatus("status.elite.requirements", "warning");
        return;
    }

    if (count >= config.maxCount)
    {
        updateStatus("status.elite.maxReached", "warning");
        return;
    }

    const cost = getScaledCost(config.cost, config.costMultiplier, count);

    if (!canAffordCost(cost))
    {
        updateStatus("status.elite.cannotAfford", "warning");
        return;
    }

    payCost(cost);
    GameState.eliteUnits[stateKey] = count + 1;

    updateStatus(trainedStatus, "success");

    updateResources();
    saveGame();
}

/* ---------- Vorrats-Hüterin ---------- */

function getStorageGuardianCost()
{
    return getScaledCost(
        STORAGE_GUARDIAN_CONFIG.cost,
        STORAGE_GUARDIAN_CONFIG.costMultiplier,
        GameState.eliteUnits.storageGuardianCount || 0
    );
}

function buyStorageGuardian()
{
    buyEliteUnit(STORAGE_GUARDIAN_CONFIG, "storageGuardianCount", "status.storageGuardian.trained");
}

function getStorageGuardianFoodConsumption()
{
    return Big(GameState.eliteUnits.storageGuardianCount || 0).mul(STORAGE_GUARDIAN_CONFIG.upkeep);
}

/* ---------- Groß-Amme ---------- */

function getGrandNurseCost()
{
    return getScaledCost(
        GRAND_NURSE_CONFIG.cost,
        GRAND_NURSE_CONFIG.costMultiplier,
        GameState.eliteUnits.grandNurseCount || 0
    );
}

function buyGrandNurse()
{
    buyEliteUnit(GRAND_NURSE_CONFIG, "grandNurseCount", "status.grandNurse.trained");
}

function getGrandNurseFoodConsumption()
{
    return Big(GameState.eliteUnits.grandNurseCount || 0).mul(GRAND_NURSE_CONFIG.upkeep);
}
