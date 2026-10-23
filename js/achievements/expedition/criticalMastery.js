/* Erfolg: Meister der Expedition */

registerAchievement({
    id: "criticalMastery",
    order: 204,
    title: "Meister der Expedition",
    locked: {
        description: "250 sehr erfolgreiche Expeditionen abschließen"
    },
    unlocked: {
        description: "250 sehr erfolgreiche Expeditionen abgeschlossen",
        reward: "Belohnung: Sehr erfolgreiche Expeditionen finden garantiert eine Ameise und bringen 50 % mehr Nahrung"
    },
    getProgress: () => ({
        current: GameState.stats.criticalExpeditionsCount,
        goal: 250
    })
});
