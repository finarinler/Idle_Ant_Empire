/* Erfolg: Sammler-Meilenstein 100 */

registerAchievement({
    category: "units",
    id: "collector100",
    order: 213,
    getProgress: () => ({ current: GameState.resources.collectors, goal: 100 })
});
