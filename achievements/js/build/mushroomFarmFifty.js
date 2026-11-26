/* Erfolg: Pilzfarm-Meister */

registerAchievement({
    category: "build",
    id: "mushroomFarmFifty",
    order: 404,
    getProgress: () => ({ current: GameState.structures.mushroomFarmCount, goal: 50 })
});
