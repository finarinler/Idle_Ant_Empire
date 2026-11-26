/* Erfolg: Pilzfarm-Magnat */

registerAchievement({
    category: "build",
    id: "mushroomFarmHundred",
    order: 405,
    getProgress: () => ({ current: GameState.structures.mushroomFarmCount, goal: 100 })
});
