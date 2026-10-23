/* Erfolg: Wissen ist Macht */

registerAchievement({
    id: "knowledgeIsPower",
    order: 10,
    title: "Wissen ist Macht",
    locked: {
        description: "Eine Vorrats-Hüterin und eine Groß-Amme ausbilden"
    },
    unlocked: {
        description: "Eine Vorrats-Hüterin und eine Groß-Amme ausgebildet",
        reward: "Belohnung: Forschung freigeschaltet"
    },
    getProgress: () =>
    {
        const guardians = Math.min(GameState.eliteUnits.storageGuardianCount, 1);
        const nurses = Math.min(GameState.eliteUnits.grandNurseCount, 1);

        return {
            current: guardians + nurses,
            goal: 2,
            text: `${guardians}/1 Hüterin · ${nurses}/1 Amme`
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
