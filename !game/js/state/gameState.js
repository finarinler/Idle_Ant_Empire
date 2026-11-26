
/* =========================
    Game State
========================= */

// Namen der Ressourcen im GameState, die als BigNum gespeichert werden
// (Ameisen-, Königinnen- und Sammlerbestände sind ebenfalls BigNum)
const BIG_RESOURCE_KEYS = ["food", "larvae", "ants", "antsFound", "bredAnts", "queens", "collectors"];

const GameState = {
    time: {
        ticks: 0,
        lastSaveTimestamp: 0
    },

    // Alle Ressourcen sind BigNum (siehe !game/js/bignum/bigNumber.js).
    resources: {
        food: Big(0),
        larvae: Big(0),
        ants: Big(0),
        antsFound: Big(0),
        bredAnts: Big(0),
        queens: Big(0),
        collectors: Big(0)
    },

    structures: {
        storageCount: 0,
        nurseryCount: 0,
        hasStorage: false,
        hasNursery: false,
        housingCount: 1,
        housingLevel: 1,
        mushroomFarmCount: 0,
        constructionLevel: 0
    },

    eliteUnits: {
        storageGuardianCount: 0,
        grandNurseCount: 0,
        broodExpertCount: 0,
        scoutCount: 0,
        builderCount: 0
    },

    // Zentrale Wirtschaft (wird ausschließlich von core/economy verändert)
    economy: {
        lastUpdateMs: 0,
        deathTimers: {},
        hatch: { active: false, remaining: 0, duration: 0 },
        trainings: {},
        unmet: { food: Big(0), larvae: Big(0) }   // nicht erfüllter Verbrauch (kumuliert)
    },

    // Zwei unabhängige Bauplätze: free = ohne Baumeisterpflicht, builder = mit Baumeisterpflicht
    construction: {
        free: null,
        builder: null
    },

    stats: {
        expeditionsCount: 0,
        expeditionAntsFound: 0,
        criticalExpeditionsCount: 0,
        failedExpeditionsCount: 0,
        totalPlayTimeSeconds: 0
    },

    achievements: {
        firstSteps: false,
        smallCollector: false,
        smallCollectorAntRewardClaimed: false,
        smallColony: false,
        buildColony: false,
        mushroomFarmTen: false,
        mushroomFarmTwentyFive: false,
        mushroomFarmFifty: false,
        mushroomFarmHundred: false,
        mushroomFarmTwoFifty: false,
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
        scoutRestUntil: 0,
        scoutEnabled: true
    },

    ui: {
        statusTimeout: null,
        // Aktuelle Statusmeldung als { key, params }, damit sie bei einem Sprachwechsel neu übersetzt werden kann
        status: { key: "status.default", params: null },
        lastLogMessage: "",
        isResetting: false
    }
};
