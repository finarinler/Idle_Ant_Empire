/* Erfolg: Kleiner Ameisenstaat */

registerAchievement({
    id: "smallColony",
    order: 400,
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 5
    }),
    onUnlock: (restored) => unlockStructuresUI(restored)
});
