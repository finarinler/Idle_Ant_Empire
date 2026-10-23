/* Erfolg: Ameisenretter */

registerAchievement({
    id: "foundTenAnts",
    order: 3,
    title: "Ameisenretter",
    locked: {
        description: "10 verirrte Ameisen auf Expeditionen finden"
    },
    unlocked: {
        description: "10 verirrte Ameisen auf Expeditionen gefunden",
        reward: "Belohnung: Fundchance für verirrte Ameisen verdoppelt"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionAntsFound,
        goal: 10
    })
});
