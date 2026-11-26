/* Erfolg: Wachsende Königinnenkolonie */

registerAchievement({
    category: "units",
    unitGroupOrder: 2,
    id: "queenColonyTwentyFive",
    order: 407,
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 25
    })
});
