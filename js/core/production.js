/* =========================
    Produktion (1x pro Sekunde)
========================= */

function updateProduction(showWarnings = true)
{
    const resources = GameState.resources;

    const antFoodProd = getAntFoodProduction();
    const antFoodCons = getAntFoodConsumption();

    const queenLarvaeProd = getQueenLarvaeProduction();
    const queenFoodCons = getQueenFoodConsumption();

    const storageGuardianCons = getStorageGuardianFoodConsumption();
    const grandNurseCons = getGrandNurseFoodConsumption();

    const essentialCons = antFoodCons.add(storageGuardianCons).add(grandNurseCons);
    const totalCons = essentialCons.add(queenFoodCons);

    resources.food = resources.food.add(antFoodProd);

    if (resources.food.gte(totalCons))
    {
        resources.food = resources.food.sub(totalCons);
        resources.larvae = resources.larvae.add(queenLarvaeProd);

        // Mangel vorbei: nächste Warnung darf wieder ins Logbuch
        GameState.ui.lastLogMessage = "";
    }
    else if (resources.food.gte(essentialCons))
    {
        resources.food = resources.food.sub(essentialCons);

        if (showWarnings && resources.queens.isPositive())
        {
            updateStatus("status.production.queensStarved", "warning");
        }
    }
    else
    {
        resources.food = BigNum.ZERO;

        if (showWarnings && totalCons.isPositive())
        {
            updateStatus("status.production.starving", "warning");
        }
    }

    updateBroodExpertProduction();

    resources.food = BigNum.min(resources.food, getMaxFoodCapacity());
    resources.larvae = BigNum.min(resources.larvae, getMaxLarvaeCapacity());
}
