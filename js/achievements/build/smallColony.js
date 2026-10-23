/* Erfolg: Kleiner Ameisenstaat */

registerAchievement({
    id: "smallColony",
    order: 400,
    title: "Kleiner Ameisenstaat",
    locked: {
        description: "5 Königinnen gekauft"
    },
    unlocked: {
        description: "5 Königinnen gekauft",
        reward: "Belohnung: Basis-Strukturen freigeschaltet"
    },
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 5
    }),
    onUnlock: (restored) => unlockStructuresUI(restored)
});
