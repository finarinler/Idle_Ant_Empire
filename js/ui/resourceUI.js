/* =========================
    Ressourcen-Anzeige
    Wird jeden Tick aufgerufen und aktualisiert auch die Einheiten-/Struktur-UIs.
========================= */

function setRateDisplay(element, rate, text)
{
    element.textContent = text;

    if (rate > 0)
    {
        element.style.color = "#66bb6a";
    }
    else if (rate < 0)
    {
        element.style.color = "#ff4444";
    }
    else
    {
        element.style.color = "#888888";
    }
}

function updateResources()
{
    const currentFoodMax = getMaxFoodCapacity();
    const currentLarvaeMax = getMaxLarvaeCapacity();

    /* 1. Ressourcen */
    if (DOM.foodCount)
    {
        DOM.foodCount.textContent = formatGameNumber(GameState.resources.food);
    }

    if (DOM.foodMax)
    {
        DOM.foodMax.textContent = `/ ${formatGameNumber(currentFoodMax)}`;
    }

    if (DOM.larvaeCount)
    {
        DOM.larvaeCount.textContent = formatGameNumber(GameState.resources.larvae);
    }

    if (DOM.larvaeMax)
    {
        DOM.larvaeMax.textContent = `/ ${formatGameNumber(currentLarvaeMax)}`;
    }

    /* 2. Nahrungsrate (ganze Zahlen) */
    if (DOM.foodRate)
    {
        let netRate = getNetFoodRate();

        if (GameState.resources.food >= currentFoodMax && netRate > 0)
        {
            netRate = 0;
        }

        const displayRate = Math.round(netRate) || 0;   // "|| 0" verhindert "-0"

        setRateDisplay(
            DOM.foodRate,
            displayRate,
            `${displayRate >= 0 ? "+" : ""}${formatGameNumber(displayRate)}/s`
        );
    }

    /* 3. Larvenrate (eine Nachkommastelle) */
    if (DOM.larvaeRate)
    {
        let netRate = getNetLarvaeRate();

        if (GameState.resources.larvae >= currentLarvaeMax && netRate > 0)
        {
            netRate = 0;
        }

        const displayRate = (Math.round(netRate * 10) / 10) || 0;

        setRateDisplay(
            DOM.larvaeRate,
            displayRate,
            `${displayRate > 0 ? "+" : ""}${formatRate(displayRate)}/s`
        );
    }

    /* 4. Einheiten-UI */
    updateAntUI();
    updateQueenUI();
    updateStorageGuardianUI();
    updateGrandNurseUI();
    updateBroodExpertUI();
    updateScoutUI();

    /* 5. Struktur-UI */
    updateFoodStorageUI();
    updateLarvaeStorageUI();

    /* 6. Erfolge */
    checkAchievements();
}
