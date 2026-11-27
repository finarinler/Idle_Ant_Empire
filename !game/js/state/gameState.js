
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
        storageRoomLevel: 1,
        broodChamberLevel: 1,
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
        broodExpertEnabled: true,
        trainings: {},
        trainingQueues: {},
        trainingQueueProgress: {},
        unmet: { food: Big(0), larvae: Big(0) }   // nicht erfüllter Verbrauch (kumuliert)
    },

    // Zwei unabhängige Bauplätze: free = ohne Baumeisterpflicht, builder = mit Baumeisterpflicht
    construction: {
        free: null,
        builder: null,
        queues: {},
        queueProgress: {}
    },

    stats: {
        expeditionsCount: 0,
        expeditionAntsFound: 0,
        criticalExpeditionsCount: 0,
        failedExpeditionsCount: 0,
        totalPlayTimeSeconds: 0,
        totalPurchasedAnts: 0,
        currentAchievementPoints: 0,
        totalAchievementPointsEarned: 0,
        achievementPointsInitialized: false,
        achievementPointsIntegrityFixApplied: false,
        prestigeCount: 0,
        prestigePoints: 0,
        totalPrestigePointsEarned: 0
    },

    research: {
        housingUpgrade: false,
        // Stufe 1 = Grundgebäude; spätere Forschung schaltet die Ausbaustufen 2–10 frei.
        storageRoomUpgradeLevel: 1,
        broodChamberUpgradeLevel: 1,
        // Höchste freigeschaltete Baukammer; Forschung erhöht diesen Wert später stufenweise.
        constructionChamberLevel: 1
    },

    achievements: {
        firstSteps: false,
        purchasedAnts1: false,
        purchasedAnts10: false,
        purchasedAnts50: false,
        purchasedAnts100: false,
        purchasedAnts250: false,
        purchasedAnts500: false,
        purchasedAnts1000: false,
        smallCollector: false,
        collector10: false,
        collector25: false,
        collector50: false,
        collector100: false,
        collector250: false,
        smallCollectorAntRewardClaimed: false,
        smallColony: false,
        queenColonyTwentyFive: false,
        queenColonyHundred: false,
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

        // Neue normale Erfolge mit EP
        foodReserve1000: false,
        foodReserve10000: false,
        larvaeReserve100: false,
        larvaeReserve500: false,
        queenCourt250: false,
        queenEmpire500: false,
        collectorHarvest500: false,
        collectorHarvest1000: false,
        mushroomFarmSettlement500: false,
        mushroomFarmMetropolis1000: false,
        purchasedAnts2000: false,
        purchasedAnts5000: false,
        expeditionColony2500: false,
        expeditionWorld5000: false,
        criticalFortune500: false,
        criticalFortune1000: false,
        colonyRescuer25: false,

        // Dauerhafte EP-Meilensteine
        epFirstSpark5: false,
        epMore10: false,
        epOnTrack25: false,
        epSmallTreasure50: false,
        epSuccessful100: false,
        epBigStep250: false,
        epCollector500: false,
        epLegend1000: false
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
