/* =========================
    Core Game Loop
========================= */
function updateResources()
{
    const totalAnts = GameState.resources.ants + GameState.resources.antsFound;

    /* 1. FIXE KAPAZITÄTEN BERECHNEN */
    const currentFoodMax = GameState.structures.storageCount > 0 
        ? 10000 
        : CORE_CONFIG.FOOD_BASE_CAPACITY;

    const currentLarvaeMax = GameState.structures.nurseryCount > 0 
        ? 2500 
        : CORE_CONFIG.LARVAE_BASE_CAPACITY;

    /* 2. RESSOURCEN ANZEIGE (Jetzt mit Formatter) */
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

    /* 3. RATEN BERECHNUNG */
    if (DOM.foodRate)
    {
        const totalProd = totalAnts * CORE_CONFIG.ANT_FOOD_PRODUCTION;
        const totalCons = (totalAnts * CORE_CONFIG.ANT_FOOD_CONSUMPTION) + (GameState.resources.queens * CORE_CONFIG.QUEEN_FOOD_CONSUMPTION);
        let netRate = totalProd - totalCons;
        
        if (GameState.resources.food >= currentFoodMax && netRate > 0)
        {
            netRate = 0;
        }
        
        const displayRate = Math.round(netRate);
        DOM.foodRate.textContent = `${displayRate >= 0 ? "+" : ""}${formatGameNumber(displayRate)}/s`;
        
        if (displayRate > 0) {
            DOM.foodRate.style.color = "#66bb6a"; 
        } else if (displayRate < 0) {
            DOM.foodRate.style.color = "#ff4444"; 
        } else {
            DOM.foodRate.style.color = "#888888"; 
        }
    }

    if (DOM.larvaeRate)
    {
        let larvaeProd = GameState.resources.queens * CORE_CONFIG.QUEEN_LARVAE_PRODUCTION;
        if (GameState.resources.larvae >= currentLarvaeMax && larvaeProd > 0)
        {
            larvaeProd = 0;
        }
        
        const displayLarvaeRate = Math.round(larvaeProd);
        DOM.larvaeRate.textContent = `${displayLarvaeRate > 0 ? "+" : ""}${formatGameNumber(displayLarvaeRate)}/s`;
        
        if (displayLarvaeRate > 0) {
            DOM.larvaeRate.style.color = "#66bb6a";
        } else {
            DOM.larvaeRate.style.color = "#888888";
        }
    }

    /* 4. EINHEITEN ANZEIGE */
    if (DOM.antCount) DOM.antCount.textContent = formatGameNumber(totalAnts);
    if (DOM.antTotal) DOM.antTotal.textContent = formatGameNumber(totalAnts);
    if (DOM.antBought) DOM.antBought.textContent = formatGameNumber(GameState.resources.ants);
    if (DOM.queenCount) DOM.queenCount.textContent = formatGameNumber(GameState.resources.queens);
    if (DOM.queenTotal) DOM.queenTotal.textContent = formatGameNumber(GameState.resources.queens);
    if (DOM.queenBought) DOM.queenBought.textContent = formatGameNumber(GameState.resources.queens);

    /* 5. BUTTON LOGIK & KOSTEN */
    if (DOM.buyAntBtn)
    {
        const foodCost = getCurrentAntFoodCost();
        const larvaeCost = CORE_CONFIG.ANT_BASE_COST_LARVAE;
        if (DOM.antCostDisplay)
        {
            DOM.antCostDisplay.textContent = `${formatGameNumber(larvaeCost)} L, ${formatGameNumber(foodCost)} F`;
        }
        DOM.buyAntBtn.disabled = (GameState.resources.larvae < larvaeCost || GameState.resources.food < foodCost);
    }

    if (DOM.buyQueenBtn)
    {
        const foodCost = getCurrentQueenFoodCost();
        const antCost = getCurrentQueenAntCost();
        if (DOM.queenCostDisplay)
        {
            DOM.queenCostDisplay.textContent = `${formatGameNumber(antCost)} A, ${formatGameNumber(foodCost)} F`;
        }
        DOM.buyQueenBtn.disabled = (GameState.resources.food < foodCost || totalAnts < antCost);
    }

    if (DOM.buyStorageBtn)
    {
        if (GameState.structures.storageCount > 0)
        {
            DOM.buyStorageBtn.disabled = true;
            DOM.buyStorageBtn.textContent = "Errichtet";
            if (DOM.cardStorage) DOM.cardStorage.classList.add("unlocked");
        }
        else
        {
            DOM.buyStorageBtn.disabled = 
                !GameState.achievements.smallColony ||
                GameState.resources.larvae < 50 ||
                GameState.resources.ants < 100 ||
                GameState.resources.queens < 10 ||
                GameState.resources.food < 1000;
        }
    }

    if (DOM.buyNurseryBtn)
    {
        if (GameState.structures.nurseryCount > 0)
        {
            DOM.buyNurseryBtn.disabled = true;
            DOM.buyNurseryBtn.textContent = "Errichtet";
            if (DOM.cardNursery) DOM.cardNursery.classList.add("unlocked");
        }
        else
        {
            DOM.buyNurseryBtn.disabled = 
                !GameState.achievements.smallColony || 
                GameState.resources.food < 3000 ||
                GameState.resources.larvae < 150 ||
                GameState.resources.ants < 150 ||
                GameState.resources.queens < 10
        }
    }

    checkAchievements();
}

function gameTick()
{
    GameState.time.ticks++;

    if (typeof updateExpedition === 'function') {
        updateExpedition();
    }

    const ticksPerSecond = 1000 / CORE_CONFIG.TICK_INTERVAL_MS;
    
    if (GameState.time.ticks % ticksPerSecond === 0) 
    {
        if (typeof updateProduction === 'function') {
            updateProduction();
        }
    }

    updateResources();
}