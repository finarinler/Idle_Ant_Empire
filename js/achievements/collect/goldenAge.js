/* Erfolg: Das goldene Zeitalter */

registerAchievement({
    id: "goldenAge",
    order: 299,
    title: "Das goldene Zeitalter",

    locked: {
        description: "250 sehr erfolgreiche Expeditionen, 300 gefundene Ameisen und 25 Königinnen"
    },

    unlocked: {
        description: "250 sehr erfolgreiche Expeditionen, 300 gefundene Ameisen und 25 Königinnen",
        reward: "Belohnung: Normale Ameisen verbrauchen keine Nahrung mehr"
    },

    getProgress: () => {
        const progress = [
            Math.min(GameState.stats.criticalExpeditionsCount / 250, 1),
            Math.min(GameState.stats.expeditionAntsFound / 300, 1),
            Math.min(GameState.resources.queens / 25, 1),
        ];

        return {
            current: progress.every(value => value >= 1) ? 1 : 0,
            goal: 1,
            text: [
                `${GameState.stats.criticalExpeditionsCount}/250 sehr erfolgreiche Expeditionen`,
                `${GameState.stats.expeditionAntsFound}/300 gefundene Ameisen`,
                `${GameState.resources.queens}/25 Königinnen`,
            ].join(" · ")
        };
    },

    onUnlock: () => {
        updateResources();
    }
});