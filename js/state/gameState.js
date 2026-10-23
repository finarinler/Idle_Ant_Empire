
/* =========================
    Game State
========================= */

const GameState = {
    time: {
        ticks: 0,
        lastSaveTimestamp: 0
    },

    resources: {
        food: 0,
        larvae: 0,
        ants: 0,
        antsFound: 0,
        bredAnts: 0,
        queens: 0
    },

    structures: {
        storageCount: 0,
        nurseryCount: 0,
        hasStorage: false,
        hasNursery: false
    },

    eliteUnits: {
        storageGuardianCount: 0,
        grandNurseCount: 0,
        broodExpertCount: 0,
        broodExpertProgress: 0,  
        scoutCount: 0
    },

    stats: {
        expeditionsCount: 0,
        expeditionAntsFound: 0,
        criticalExpeditionsCount: 0,
    },

    achievements: {
        firstSteps: false,
        smallCollector: false,
        smallColony: false,
        buildColony: false,
        knowledgeIsPower: false,
        foundTenAnts: false,
        expeditionVeteran: false,
        speedExpeditions: false,
        expeditionCommander: false,
        criticalMastery: false,
        goldenAge: false,
    },

    expedition: {
        isActive: false,
        startTime: 0,
        progress: 0,
        scoutRestUntil: 0
    },

    ui: {
        statusTimeout: null,
        defaultStatus: "Deine Kolonie ist bereit und wartet",
        lastLogMessage: "",
        isResetting: false
    }
};
