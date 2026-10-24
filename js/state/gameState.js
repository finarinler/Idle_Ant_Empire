
/* =========================
    Game State
========================= */

// Namen der Ressourcen im GameState, die als BigNum gespeichert werden
const BIG_RESOURCE_KEYS = ["food", "larvae", "ants", "antsFound", "bredAnts", "queens"];

const GameState = {
    time: {
        ticks: 0,
        lastSaveTimestamp: 0
    },

    // Alle Ressourcen sind BigNum (siehe js/bignum/bigNumber.js).
    resources: {
        food: Big(0),
        larvae: Big(0),
        ants: Big(0),
        antsFound: Big(0),
        bredAnts: Big(0),
        queens: Big(0)
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
        failedExpeditionsCount: 0,
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
        expeditionMisfortune: false,
        expeditionMisfortuneMaster: false,
        expeditionMisfortuneLegend: false,
    },

    expedition: {
        isActive: false,
        startTime: 0,
        progress: 0,
        scoutRestUntil: 0
    },

    ui: {
        statusTimeout: null,
        // Aktuelle Statusmeldung als { key, params }, damit sie bei einem Sprachwechsel neu übersetzt werden kann
        status: { key: "status.default", params: null },
        lastLogMessage: "",
        isResetting: false
    }
};
