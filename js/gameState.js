/* =========================
    Game State
========================= */

const GameState = {
    time: {
        ticks: 0
    },
    resources: {
        food: 0,
        larvae: 0,
        ants: 0,
        antsFound: 0,
        queens: 0
    },
    structures: {
        storageCount: 0,
        nurseryCount: 0,
        hasStorage: false,
        hasNursery: false
    },
    stats: {
        expeditionsCount: 0
    },
    achievements: {
        firstSteps: false,
        smallCollector: false,
        smallColony: false,
        buildColony: false
    },
    expedition: {
        isActive: false,
        startTime: 0,
        progress: 0
    },
    ui: {
        statusTimeout: null,
        defaultStatus: "Deine Kolonie ist bereit und wartet",
        lastLogMessage: ""
    }
};