/* Erfolg: Königinnen-Dynastie */

registerAchievement({
    category: "units",
    id: "queenColonyHundred",
    order: 408,
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 100
    })
});
