/* =========================
    Netto-Raten pro Sekunde (für die Anzeige)
========================= */

function getNetFoodRate()
{
    return getAntFoodProduction()
        .sub(getAntFoodConsumption())
        .sub(getQueenFoodConsumption())
        .sub(getStorageGuardianFoodConsumption())
        .sub(getGrandNurseFoodConsumption());
}

function getNetLarvaeRate()
{
    return getQueenLarvaeProduction().sub(getBroodExpertLarvaeConsumption());
}
