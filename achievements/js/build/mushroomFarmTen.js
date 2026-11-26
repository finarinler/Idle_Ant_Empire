/* Erfolg: Pilzfarm-Pionier */

registerAchievement({
    category: "build",
    id: "mushroomFarmTen",
    order: 402,
    getProgress: () => ({
        current: GameState.structures.mushroomFarmCount,
        goal: 10
    })
});
