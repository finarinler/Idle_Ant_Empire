/* Erfolg: Pilzfarm-Legende */

registerAchievement({
    category: "build",
    id: "mushroomFarmTwoFifty",
    order: 406,
    getProgress: () => ({ current: GameState.structures.mushroomFarmCount, goal: 250 })
});
