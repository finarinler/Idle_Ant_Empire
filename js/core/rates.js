/* =========================
    Netto-Raten pro Sekunde (für die Anzeige)
========================= */

function getNetFoodRate()
{
    return getAntFoodProduction()
        - getAntFoodConsumption()
        - getQueenFoodConsumption()
        - getStorageGuardianFoodConsumption()
        - getGrandNurseFoodConsumption();
}

function getNetLarvaeRate()
{
    return getQueenLarvaeProduction() - getBroodExpertLarvaeConsumption();
}
