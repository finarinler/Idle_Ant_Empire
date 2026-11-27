/* =========================
    Ressourcen-Anzeige
    Wird jeden Tick aufgerufen und aktualisiert auch alle Karten.
========================= */

function setRateDisplay(element, rate, text)
{
    I18N.renderInto(element, text);

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
    const flows = Economy.computeFlows();
    const currentFoodMax = flows.capacity.food;
    const currentLarvaeMax = flows.capacity.larvae;

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

    /* 2. Nahrungsrate (eine Nachkommastelle) plus theoretisches Maximum */
    if (DOM.foodRate)
    {
        let netRate = flows.net.food;

        if (resources.food.gte(currentFoodMax) && netRate.isPositive())
        {
            netRate = BigNum.ZERO;
        }

        const displayRate = netRate.roundTo(1);
        const currentDisplay = DOM.foodRate.querySelector(".food-rate-current");
        const maxDisplay = DOM.foodRate.querySelector(".resource-rate-max");

        if (currentDisplay)
        {
            setRateDisplay(
                currentDisplay,
                displayRate,
                `${displayRate.isPositive() ? "+" : ""}${formatRate(displayRate)} [[F]]/s`
            );
        }

        if (maxDisplay)
        {
            const maxRate = flows.maxNet.food.roundTo(1);
            maxDisplay.textContent = `${I18N.t("resource.maxRate")}: ${maxRate.isPositive() ? "+" : ""}${formatRate(maxRate)} [[F]]/s`;
        }
    }

    /* 3. Larvenrate (eine Nachkommastelle) plus theoretisches Maximum */
    if (DOM.larvaeRate)
    {
        let netRate = flows.net.larvae;

        if (resources.larvae.gte(currentLarvaeMax) && netRate.isPositive())
        {
            netRate = BigNum.ZERO;
        }

        const displayRate = netRate.roundTo(1);
        const currentDisplay = DOM.larvaeRate.querySelector(".larvae-rate-current");
        const maxDisplay = DOM.larvaeRate.querySelector(".larvae-rate-max");

        if (currentDisplay)
        {
            setRateDisplay(
                currentDisplay,
                displayRate,
                `${displayRate.isPositive() ? "+" : ""}${formatRate(displayRate)} [[L]]/s`
            );
        }

        if (maxDisplay)
        {
            const maxRate = flows.maxNet.larvae.roundTo(1);
            maxDisplay.textContent = `${I18N.t("resource.maxRate")}: ${maxRate.isPositive() ? "+" : ""}${formatRate(maxRate)} [[L]]/s`;
        }
    }

    /* 4. Karten (Einheiten, Gebäude, Forschung) */
    CardBuilder.updateAll();
    updateBroodExpertProgressUI();
    updateTrainingProgressUI();
    updateConstructionProgressUI();

    /* 6. Expeditionsbutton (Zustand wird jeden Tick aus dem Spielzustand abgeleitet) */
    updateExpeditionButtonState();

    /* 7. Erfolge */
    checkAchievements();
}
