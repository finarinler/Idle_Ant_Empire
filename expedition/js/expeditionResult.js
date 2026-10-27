
/* =========================
    Expedition: Ergebnis auswürfeln
========================= */

function completeExpedition()
{
    // Nur eine tatsächlich laufende Expedition kann abgeschlossen werden.
    // Verhindert doppelte Belohnungen bei mehrfachen / direkten Aufrufen.
    if (!GameState.expedition.isActive)
    {
        return false;
    }

    GameState.expedition.isActive = false;
    GameState.expedition.progress = 0;
    GameState.expedition.startTime = 0;
    GameState.stats.expeditionsCount++;

    // Kundschafterin braucht nach jeder Expedition Erholung
    if (hasScout())
    {
        GameState.expedition.scoutRestUntil = Date.now() + CORE_CONFIG.SCOUT_REST_MS;
    }

    const criticalSuccess = rollFoodReward();
    rollStrayAnt(criticalSuccess);

    setExpeditionIdleUI();
    updateResources();   // Prüft auch die Erfolge
    saveGame();

    return true;
}

/**
 * Würfelt den Nahrungsfund.
 * Gibt true zurück, wenn es ein kritischer Erfolg war.
 */
function rollFoodReward()
{
    // Misserfolgswahrscheinlichkeit abhängig von den Achievements
    const failureChance =
        GameState.achievements.expeditionMisfortuneLegend ? 0 :
        GameState.achievements.expeditionMisfortuneMaster ? 1 :
        GameState.achievements.expeditionMisfortune ? 2.5 :
        5;

    // Misserfolg prüfen
    if (Math.random() * 100 < failureChance)
    {
        GameState.stats.failedExpeditionsCount++;

        triggerExpeditionFailureGlow();

        updateStatus("status.expedition.failed", "warning");
        return false;
    }

    // Kritische Erfolgswahrscheinlichkeit bestimmen
    const criticalChance = GameState.achievements.expeditionMisfortuneLegend
        ? 15
        : GameState.achievements.expeditionVeteran
            ? 10
            : 5;

    // Kritischen Erfolg prüfen
    if (Math.random() * 100 < criticalChance)
    {
        GameState.stats.criticalExpeditionsCount++;

        let amount = getCriticalReward();

        // Meister der Expedition: 50 % mehr Nahrung
        if (GameState.achievements.criticalMastery)
        {
            amount = Math.ceil(amount * 1.5);
        }

        GameState.resources.food = GameState.resources.food.add(amount);

        // Goldener Glow bei kritischem Erfolg
        triggerExpeditionGlow();

        updateStatus(
            "status.expedition.criticalSuccess",
            "success",
            false,
            { amount }
        );

        return true;
    }

    // Normaler Erfolg
    const amount = getNormalReward();
    GameState.resources.food = GameState.resources.food.add(amount);

    updateStatus(
        "status.expedition.success",
        "success",
        false,
        { amount }
    );

    return false;
}

/**
 * Würfelt den Fund einer verirrten Ameise.
 */
function rollStrayAnt(criticalSuccess)
{
    if (criticalSuccess && GameState.achievements.criticalMastery)
    {
        // Garantierter Ameisenfund bei kritischem Erfolg
        addFoundAnt("status.ant.foundCritical");

        return;
    }

    if (GameState.achievements.smallCollector)
    {
        const antChance = GameState.achievements.foundTenAnts ? 10 : 5;

        if (Math.random() * 100 < antChance)
        {
            addFoundAnt("status.ant.foundStray");
        }
    }
}

/**
 * Fügt eine gefundene Ameise hinzu.
 */
function addFoundAnt(messageKey)
{
    GameState.resources.antsFound = GameState.resources.antsFound.add(1);
    GameState.stats.expeditionAntsFound++;

    updateStatus(messageKey, "success");
}