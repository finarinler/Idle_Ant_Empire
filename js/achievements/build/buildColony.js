/* Erfolg: Bau der Kolonie */

registerAchievement({
    id: "buildColony",
    order: 401,
    getProgress: () => ({
        current: (GameState.structures.hasStorage ? 1 : 0) + (GameState.structures.hasNursery ? 1 : 0),
        goal: 2
    }),
    onUnlock: (restored) => unlockEliteUI(restored)
});
