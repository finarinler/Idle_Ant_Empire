/* =========================
    Ameisen-Pool (nur Lesezugriff)
    Gekaufte, gefundene und gezüchtete Ameisen zählen zusammen.
    Abzüge (Käufe, Todesfälle) führt ausschließlich die zentrale Wirtschaft aus
    (Reihenfolge: gekaufte, gefundene, gezüchtete).
========================= */

function getTotalAnts()
{
    return GameState.resources.ants
        .add(GameState.resources.antsFound)
        .add(GameState.resources.bredAnts);
}
