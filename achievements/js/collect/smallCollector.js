/* Erfolg: Kleiner Sammler */

registerAchievement({
    category: "collect",
    id: "smallCollector",
    order: 200,
    getProgress: () => ({
        current: GameState.resources.food,
        goal: 150
    })
});
