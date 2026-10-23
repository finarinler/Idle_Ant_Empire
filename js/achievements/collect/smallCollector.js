/* Erfolg: Kleiner Sammler */

registerAchievement({
    id: "smallCollector",
    order: 200,
    title: "Kleiner Sammler",
    locked: {
        description: "150 Nahrung gesammelt"
    },
    unlocked: {
        description: "150 Nahrung gesammelt",
        reward: "Belohnung: Chance eine verirrte Ameise auf Expeditionen zu finden"
    },
    getProgress: () => ({
        current: GameState.resources.food,
        goal: 150
    })
});
