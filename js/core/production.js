/* =========================
    Produktion (1x pro Sekunde)
========================= */

function updateProduction(showWarnings = true)
{
    const antFoodProd = getAntFoodProduction();
    const antFoodCons = getAntFoodConsumption();

    const queenLarvaeProd = getQueenLarvaeProduction();
    const queenFoodCons = getQueenFoodConsumption();

    const storageGuardianCons = getStorageGuardianFoodConsumption();
    const grandNurseCons = getGrandNurseFoodConsumption();

    const essentialCons = antFoodCons + storageGuardianCons + grandNurseCons;
    const totalCons = essentialCons + queenFoodCons;

    GameState.resources.food += antFoodProd;

    if (GameState.resources.food >= totalCons)
    {
        GameState.resources.food -= totalCons;
        GameState.resources.larvae += queenLarvaeProd;

        // Mangel vorbei: nächste Warnung darf wieder ins Logbuch
        GameState.ui.lastLogMessage = "";
    }
    else if (GameState.resources.food >= essentialCons)
    {
        GameState.resources.food -= essentialCons;

        if (showWarnings && GameState.resources.queens > 0)
        {
            updateStatus("Produktion gestoppt: Zu wenig Nahrung für die Königinnen!", "warning");
        }
    }
    else
    {
        GameState.resources.food = 0;

        if (showWarnings && totalCons > 0)
        {
            updateStatus("Kritischer Nahrungsmangel: Die Kolonie hungert!", "warning");
        }
    }

    updateBroodExpertProduction();

    GameState.resources.food = Math.min(GameState.resources.food, getMaxFoodCapacity());
    GameState.resources.larvae = Math.min(GameState.resources.larvae, getMaxLarvaeCapacity());
}
