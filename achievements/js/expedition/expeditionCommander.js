/* Erfolg: Expeditionskommando */

registerAchievement({
    category: "expedition",
    id: "expeditionCommander",
    order: 302,
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 1000
    }),
    onUnlock: (restored) => unlockScoutUI(restored)
});
