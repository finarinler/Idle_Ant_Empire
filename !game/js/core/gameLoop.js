/* =========================
    Game Loop
    Der Tick treibt nur noch die Anzeige und die Expeditionen an. Die Wirtschaft
    rechnet mit der tatsächlich verstrichenen Zeit (Economy.update) und ist damit
    unabhängig von Tick-Rate, Bildwiederholrate und Tab-Drosselung.
========================= */

let gameTickTimer = null;
let autoSaveTimer = null;

// Autosave: 60 s nach dem letzten Speichern (jedes Speichern setzt den Zähler zurück)
function restartAutosaveTimer()
{
    if (autoSaveTimer !== null)
    {
        clearTimeout(autoSaveTimer);
    }

    autoSaveTimer = setTimeout(saveGame, CORE_CONFIG.SAVE_INTERVAL_MS);
}

// Meldungen und Sonder-Save zu Ereignissen der zentralen Wirtschaft
function handleEconomyResult(result)
{
    if (!result)
    {
        return;
    }

    const deaths = {};

    result.deaths.forEach(death => { deaths[death.unit] = (deaths[death.unit] || 0) + 1; });

    Object.keys(deaths).forEach(unitId =>
    {
        updateStatus("status.unit.died", "warning", false, {
            count: deaths[unitId],
            unit: { key: UnitRegistry.get(unitId).nameKey }
        });
    });

    let needsSpecialSave = false;

    result.completed.forEach(event =>
    {
        if (event.type === "training")
        {
            const def = UnitRegistry.get(event.unit);
            updateStatus(
                def.recruit.announce && def.recruit.messageKey ? def.recruit.messageKey : "status.unit.trainingCompleted",
                "success",
                false,
                { unit: { key: def.nameKey } }
            );

            if (event.durationSeconds >= CORE_CONFIG.SPECIAL_SAVE_MIN_SECONDS)
            {
                needsSpecialSave = true;
            }
            return;
        }

        if (event.type !== "build") { return; }

        updateStatus("status.build.completed", "success", false, {
            structure: { key: StructureRegistry.get(event.structure).nameKey }
        });

        // Automatische Abschlüsse ab 60 s lösen (gemeinsam) einen Sonder-Save aus
        if (event.durationSeconds >= CORE_CONFIG.SPECIAL_SAVE_MIN_SECONDS)
        {
            needsSpecialSave = true;
        }
    });

    if (needsSpecialSave)
    {
        saveGame();
    }
}

function warnAboutShortages()
{
    const flows = Economy.computeFlows();

    if (flows.stock.food.isZero() && flows.ratio.food < 1)
    {
        updateStatus("status.production.starving", "warning");
    }
}

function gameTick()
{
    GameState.time.ticks++;

    handleEconomyResult(Economy.update());

    updateExpedition();
    updateScoutAutomation();
    updateResources();

    if (GameState.time.ticks % 10 === 0)
    {
        warnAboutShortages();
    }
}

function startGameLoop()
{
    // Nie zwei Timer parallel laufen lassen (sonst doppelte Berechnung / Expeditionen)
    if (gameTickTimer !== null)
    {
        return;
    }

    gameTickTimer = setInterval(gameTick, CORE_CONFIG.TICK_INTERVAL_MS);
    restartAutosaveTimer();
}
