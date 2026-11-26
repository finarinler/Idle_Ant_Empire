/* Erfolg: Sammler-Meilenstein 250 */

registerAchievement({
    category: "units",
    id: "collector250",
    order: 214,
    getProgress: () => ({ current: GameState.resources.collectors, goal: 250 })
});
