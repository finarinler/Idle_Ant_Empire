/* =========================
    Expedition: Ergebnis auswürfeln
========================= */

function completeExpedition()
{
    GameState.expedition.isActive = false;
    GameState.expedition.progress = 0;
    GameState.expedition.startTime = 0;
    GameState.stats.expeditionsCount++;

    // Kundschafterin braucht nach jeder Expedition Erholung
    if (GameState.eliteUnits.scoutCount > 0)
    {
        GameState.expedition.scoutRestUntil = Date.now() + CORE_CONFIG.SCOUT_REST_MS;
    }

    const criticalSuccess = rollFoodReward();
    rollStrayAnt(criticalSuccess);

    setExpeditionIdleUI();
    updateResources();   // prüft auch die Erfolge
    saveGame();
}

/**
 * Würfelt den Nahrungsfund. Gibt true zurück, wenn es ein kritischer Erfolg war.
 */
function rollFoodReward()
{
    const findRoll = Math.random() * 100;

    if (findRoll >= 95)
    {
        updateStatus("Expedition erfolglos: Nichts gefunden.", "warning");
        return false;
    }

    const criticalChance = GameState.achievements.expeditionVeteran ? 10 : 5;

    if (Math.random() * 100 < criticalChance)
    {
        GameState.stats.criticalExpeditionsCount++;

        let amount = getCriticalReward();

        // Meister der Expedition: 50 % mehr Nahrung
        if (GameState.achievements.criticalMastery)
        {
            amount = Math.ceil(amount * 1.5);
        }

        GameState.resources.food += amount;

        triggerExpeditionGlow();
        updateStatus(`Expedition sehr erfolgreich: ${amount} Nahrung gefunden.`, "success");

        return true;
    }

    const amount = getNormalReward();
    GameState.resources.food += amount;
    updateStatus(`Expedition erfolgreich: ${amount} Nahrung gefunden.`, "success");

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
        addFoundAnt("Kritischer Erfolg! Eine Ameise hat sich deiner Kolonie angeschlossen!");
        return;
    }

    if (GameState.achievements.smallCollector)
    {
        const antChance = GameState.achievements.foundTenAnts ? 10 : 5;

        if (Math.random() * 100 < antChance)
        {
            addFoundAnt("Eine verirrte Ameise hat sich deiner Kolonie angeschlossen!");
        }
    }
}

function addFoundAnt(message)
{
    GameState.resources.antsFound++;
    GameState.stats.expeditionAntsFound++;
    updateStatus(message, "success");
}
