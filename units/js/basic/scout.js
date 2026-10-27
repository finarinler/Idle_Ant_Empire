/* =========================
    Kundschafterin
    Startet Expeditionen automatisch, braucht danach eine Erholungspause.
    Sobald eine Kundschafterin existiert, ist der manuelle Expeditionsbutton
    gesperrt (abgeleitet aus GameState.eliteUnits.scoutCount, siehe expeditionControl.js).
========================= */

const SCOUT_CONFIG = {
    cost: { ants: 50, food: 5000, larvae: 1000, queens: 1 },
    maxCount: 1
};

/* ---------- Kauf ---------- */

function buyScout()
{
    if (!GameState.achievements.expeditionCommander)
    {
        updateStatus(
            "status.scout.needAchievement",
            "warning",
            false,
            { achievement: { key: "achievement.expeditionCommander.title" } }
        );
        return;
    }

    const count = GameState.eliteUnits.scoutCount || 0;

    if (count >= SCOUT_CONFIG.maxCount)
    {
        updateStatus("status.scout.alreadyTrained", "warning");
        return;
    }

    if (!canAffordCost(SCOUT_CONFIG.cost) || !payCost(SCOUT_CONFIG.cost))
    {
        updateStatus("status.scout.cannotAfford", "warning");
        return;
    }

    GameState.eliteUnits.scoutCount = count + 1;
    GameState.expedition.scoutRestUntil = 0;

    updateStatus("status.scout.trained", "success");

    // Button sofort sperren (leitet sich aus dem Spielzustand ab)
    updateExpeditionButtonState();
    updateResources();
    saveGame();
}

/* ---------- Automatik (jeder Tick) ---------- */

function updateScoutAutomation()
{
    // Alle Bedingungen (Scout vorhanden, keine laufende Expedition, Erholung vorbei)
    // werden in startScoutExpedition() geprüft.
    startScoutExpedition();
}
