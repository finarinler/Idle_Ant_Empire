/* =========================
    Ressourcen-Anzeige
    Wird jeden Tick aufgerufen und aktualisiert auch die Einheiten-/Struktur-UIs.
========================= */

function setRateDisplay(element, rate, text)
{
    element.textContent = text;

    if (rate.isPositive())
    {
        element.style.color = "#66bb6a";
    }
    else if (rate.isNegative())
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
    const resources = GameState.resources;
    const currentFoodMax = getMaxFoodCapacity();
    const currentLarvaeMax = getMaxLarvaeCapacity();

    /* 1. Ressourcen */
    if (DOM.foodCount)
    {
        DOM.foodCount.textContent = formatGameNumber(resources.food);
    }

    if (DOM.foodMax)
    {
        DOM.foodMax.textContent = `/ ${formatGameNumber(currentFoodMax)}`;
    }

    if (DOM.larvaeCount)
    {
        DOM.larvaeCount.textContent = formatGameNumber(resources.larvae);
    }

    if (DOM.larvaeMax)
    {
        DOM.larvaeMax.textContent = `/ ${formatGameNumber(currentLarvaeMax)}`;
    }

    /* 2. Nahrungsrate (ganze Zahlen) */
    if (DOM.foodRate)
    {
        let netRate = getNetFoodRate();

        if (resources.food.gte(currentFoodMax) && netRate.isPositive())
        {
            netRate = BigNum.ZERO;
        }

        const displayRate = netRate.round();   // BigNum kennt kein "-0"

        setRateDisplay(
            DOM.foodRate,
            displayRate,
            `${displayRate.isNegative() ? "" : "+"}${formatGameNumber(displayRate)}/s`
        );
    }

    /* 3. Larvenrate (eine Nachkommastelle) */
    if (DOM.larvaeRate)
    {
        let netRate = getNetLarvaeRate();

        if (resources.larvae.gte(currentLarvaeMax) && netRate.isPositive())
        {
            netRate = BigNum.ZERO;
        }

        const displayRate = netRate.roundTo(1);

        setRateDisplay(
            DOM.larvaeRate,
            displayRate,
            `${displayRate.isPositive() ? "+" : ""}${formatRate(displayRate)}/s`
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

    /* 6. Expeditionsbutton (Zustand wird jeden Tick aus dem Spielzustand abgeleitet) */
    updateExpeditionButtonState();

    /* 7. Erfolge */
    checkAchievements();
}
