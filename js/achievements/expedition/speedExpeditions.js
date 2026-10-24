/* Erfolg: Schnelle Pfoten */

registerAchievement({
    id: "speedExpeditions",
    order: 301,
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
