/* Erfolg: Meister der Expedition */

registerAchievement({
    id: "criticalMastery",
    order: 5,
    title: "Meister der Expedition",
    locked: {
        description: "50 sehr erfolgreiche Expeditionen abschließen"
    },
    unlocked: {
        description: "50 sehr erfolgreiche Expeditionen abgeschlossen",
        reward: "Belohnung: Sehr erfolgreiche Expeditionen finden garantieren eine Ameise und bringen 50 % mehr Nahrung"
    },
    getProgress: () => ({
        current: GameState.stats.criticalExpeditionsCount,
        goal: 50
    })
});
