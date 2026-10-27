/* =========================
    Voraussetzungen für Elite-Einheiten
========================= */

function hasEliteRequirements()
{
    return GameState.structures.storageCount > 0
        && GameState.structures.nurseryCount > 0;
}
