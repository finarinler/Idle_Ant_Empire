/* Erfolg: Kleiner Sammler */

registerAchievement({
    id: "smallCollector",
    order: 200,
    getProgress: () => ({
        current: GameState.resources.food,
        goal: 150
    })
});
