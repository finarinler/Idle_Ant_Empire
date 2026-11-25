/* Erfolg: Kleiner Sammler */

registerAchievement({
    category: "collect",
    id: "smallCollector",
    order: 200,
    getProgress: () => ({
        current: GameState.resources.food,
        goal: 150
    }),
    onUnlock: () => {
        // Einmalige Startbelohnung: Auch bereits freigeschaltete
        // Erfolge aus älteren Spielständen erhalten sie nach dem Update.
        if (GameState.achievements.smallCollectorAntRewardClaimed) {
            return;
        }

        // Flag zuerst setzen, damit die Ameise niemals doppelt vergeben wird.
        GameState.achievements.smallCollectorAntRewardClaimed = true;

        Economy.addFoundAnt(1);
        GameState.stats.expeditionAntsFound++;

        updateStatus("status.ant.foundStray", "success");
    }
});
