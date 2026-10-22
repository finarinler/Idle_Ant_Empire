/* Erfolg: Meister der Expedition */

registerAchievement({
    id: "criticalMastery",
    order: 5,
    title: "Meister der Expedition",
    locked: {
        description: "50 kritische Expeditionen abschließen"
    },
    unlocked: {
        description: "50 kritische Expeditionen abgeschlossen",
        reward: "Belohnung: Kritische Expeditionen finden garantiert eine Ameise und bringen 50 % mehr Nahrung"
    },
    getProgress: () => ({
        current: GameState.stats.criticalExpeditionsCount,
        goal: 50
    })
});
