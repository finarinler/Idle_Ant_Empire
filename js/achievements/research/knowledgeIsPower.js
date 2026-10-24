/* Erfolg: Wissen ist Macht */

registerAchievement({
    id: "knowledgeIsPower",
    order: 500,
    getProgress: () =>
    {
        const guardians = Math.min(GameState.eliteUnits.storageGuardianCount, 1);
        const nurses = Math.min(GameState.eliteUnits.grandNurseCount, 1);

        return {
            current: guardians + nurses,
            goal: 2,
            textKey: "achievement.knowledgeIsPower.progress",
            textParams: { guardians, nurses }
        };
    },
    onUnlock: (restored) =>
    {
        if (!restored)
        {
            saveGame();
        }
    }
});
