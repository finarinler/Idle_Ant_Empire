/* Erfolg: Wachsende Königinnenkolonie */

registerAchievement({
    category: "units",
    id: "queenColonyTwentyFive",
    order: 407,
    getProgress: () => ({
        current: GameState.resources.queens,
        goal: 25
    })
});
