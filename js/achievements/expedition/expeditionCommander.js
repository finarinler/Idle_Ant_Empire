/* Erfolg: Expeditionskommando */

registerAchievement({
    id: "expeditionCommander",
    order: 7,
    title: "Expeditionskommando",
    locked: {
        description: "1.000 Expeditionen abschließen"
    },
    unlocked: {
        description: "1.000 Expeditionen abgeschlossen",
        reward: "Belohnung: Kundschafterin freigeschaltet"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 1000
    }),
    onUnlock: (restored) => unlockScoutUI(restored)
});
