/* =========================
    Voraussetzungen für Elite-Einheiten
========================= */

const ELITE_REQUIREMENT_MESSAGE = "Du benötigst zuerst Vorratskammer und Brutkammer.";

function hasEliteRequirements()
{
    return GameState.structures.storageCount > 0
        && GameState.structures.nurseryCount > 0;
}
