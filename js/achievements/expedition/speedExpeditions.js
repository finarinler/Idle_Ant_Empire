/* Erfolg: Schnelle Pfoten */

registerAchievement({
    id: "speedExpeditions",
    order: 301,
    title: "Schnelle Pfoten",
    locked: {
        description: "500 Expeditionen abschließen"
    },
    unlocked: {
        description: "500 Expeditionen abgeschlossen",
        reward: "Belohnung: Expeditionsdauer dauerhaft auf 5 Sekunden reduziert"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 500
    }),
    onUnlock: () =>
    {
        // Button-Text zeigt die neue Dauer an (nicht während einer laufenden Expedition)
        if (!GameState.expedition.isActive)
        {
            setExpeditionIdleUI();
        }
    }
});
