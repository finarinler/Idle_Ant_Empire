/* Erfolg: Kleiner Ameisenstaat */

registerAchievement({
    id: "smallColony",
    order: 8,
    title: "Kleiner Ameisenstaat",
    locked: {
        description: "10 Königinnen gekauft"
    },
    unlocked: {
        description: "10 Königinnen gekauft",
        reward: "Belohnung: Basis-Strukturen freigeschaltet"
    },
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 10
    }),
    onUnlock: (restored) => unlockStructuresUI(restored)
});
