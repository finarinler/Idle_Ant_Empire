/* Erfolg: Das goldene Zeitalter */

registerAchievement({
    id: "goldenAge",
    order: 299,

    getProgress: () => {
        const critical = GameState.stats.criticalExpeditionsCount;
        const antsFound = GameState.stats.expeditionAntsFound;
        const queens = GameState.resources.queens;

        const reached = critical >= 250
            && antsFound >= 300
            && queens.gte(25);

        return {
            current: reached ? 1 : 0,
            goal: 1,
            textKey: "achievement.goldenAge.progress",
            textParams: { critical, ants: antsFound, queens }
        };
    },

    onUnlock: () => {
        updateResources();
    }
});
