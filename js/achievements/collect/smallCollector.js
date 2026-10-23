/* Erfolg: Kleiner Sammler */

registerAchievement({
    id: "smallCollector",
    order: 2,
    title: "Kleiner Sammler",
    locked: {
        description: "300 Nahrung gesammelt"
    },
    unlocked: {
        description: "300 Nahrung gesammelt",
        reward: "Belohnung: Chance eine verirrte Ameise auf Expeditionen zu finden"
    },
    getProgress: () => ({
        current: GameState.resources.food,
        goal: 300
    })
});
