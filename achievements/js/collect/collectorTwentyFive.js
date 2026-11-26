/* Erfolg: Sammler-Meilenstein 25 */

registerAchievement({
    category: "units",
    unitGroupOrder: 3,
    id: "collector25",
    order: 211,
    getProgress: () => ({ current: GameState.resources.collectors, goal: 25 })
});
