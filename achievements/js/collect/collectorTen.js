/* Erfolg: Sammler-Meilenstein 10 */

registerAchievement({
    category: "units",
    id: "collector10",
    order: 210,
    getProgress: () => ({ current: GameState.resources.collectors, goal: 10 })
});
