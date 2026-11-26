/* Erfolg: Königinnen-Dynastie */

registerAchievement({
    category: "units",
    unitGroupOrder: 2,
    id: "queenColonyHundred",
    order: 408,
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 100
    })
});
