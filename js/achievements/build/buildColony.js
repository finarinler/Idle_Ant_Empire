/* Erfolg: Bau der Kolonie */

registerAchievement({
    id: "buildColony",
    order: 9,
    title: "Bau der Kolonie",
    locked: {
        description: "Vorratskammer und Brutkammer errichtet"
    },
    unlocked: {
        description: "Vorratskammer und Brutkammer errichtet",
        reward: "Belohnung: Spezialeinheiten freigeschaltet"
    },
    getProgress: () => ({
        current: (GameState.structures.hasStorage ? 1 : 0) + (GameState.structures.hasNursery ? 1 : 0),
        goal: 2
    }),
    onUnlock: (restored) => unlockEliteUI(restored)
});
