/* Erfolg: Pilzfarm-Imperium */

registerAchievement({
    category: "build",
    id: "mushroomFarmTwentyFive",
    order: 403,
    getProgress: () => ({
        current: GameState.structures.mushroomFarmCount,
        goal: 25
    })
});
