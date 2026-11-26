/* Erfolg: Sammler-Meilenstein 50 */

registerAchievement({
    category: "collect",
    id: "collector50",
    order: 212,
    getProgress: () => ({ current: GameState.resources.collectors, goal: 50 })
});
