/* =========================
    Lagerkapazitäten
    Struktur ersetzt die Basis-Kapazität,
    jede Hüterin / Groß-Amme verdoppelt das Ergebnis.
========================= */

function getMaxFoodCapacity()
{
    const baseCapacity = GameState.structures.storageCount > 0
        ? CORE_CONFIG.FOOD_STORAGE_CAPACITY
        : CORE_CONFIG.FOOD_BASE_CAPACITY;

    return baseCapacity * Math.pow(2, GameState.eliteUnits.storageGuardianCount || 0);
}

function getMaxLarvaeCapacity()
{
    const baseCapacity = GameState.structures.nurseryCount > 0
        ? CORE_CONFIG.LARVAE_NURSERY_CAPACITY
        : CORE_CONFIG.LARVAE_BASE_CAPACITY;

    return baseCapacity * Math.pow(2, GameState.eliteUnits.grandNurseCount || 0);
}
