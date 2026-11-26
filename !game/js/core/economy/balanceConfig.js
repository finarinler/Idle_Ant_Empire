/* =========================================================
    Zentrale Balance-Konfiguration
    ALLE Zahlenwerte der Wirtschaft, die nicht direkt zu einer Einheit
    gehören, stehen hier. Die Definitionsdateien lesen sie von hier.

    Kennzeichnung:
      VERBINDLICH   Vom Auftrag oder bestehenden Code festgelegt.
      ÜBERNOMMEN    Aus dem bisherigen Code übernommen.
      VORLÄUFIG     Vorschlag, wartet auf Freigabe (siehe Balanceübersicht).
========================================================= */

const BALANCE = {

    // Liefert die Dauer anhand der Nummer des neu gebauten/ausgebildeten Objekts.
    getCountBasedSeconds(count, tiers) {
        const tier = tiers.find(item => count <= item.max);
        return (tier || tiers[tiers.length - 1]).seconds;
    },

    /* ---------- VERBINDLICH ---------- */

    // Feste Ausbildungszeiten für alle rekrutierbaren Einheitentypen (Sekunden)
    trainingSeconds: {
        "normal-ant": 5,
        "queen": 15,
        "collector": 30,
        "storage-keeper": 150,
        "grand-nurse": 150,
        "builder": 300,
        "brood-expert": 300,
        "scout": 600
    },

    // Schlupfzeit pro Ameise je Anzahl Brutexpertinnen (Sekunden)
    hatchSecondsByExperts: { 1: 10, 2: 9, 3: 7, 4: 5, 5: 3 },

    builder: {
        reductionPerBuilder: 0.05,   // 5 % je Baumeister
        maxBuilders: 10
    },

    housing: {
        baseCapacityPerChamber: 10,
        costGrowth: 1.10,                                             // +10 % je weiterer Wohnkammer
        maxLevel: 10,
        // Zeit je Upgrade-Stufe in Sekunden: 1→2 ... 9→10
        upgradeSeconds: [120, 300, 600, 900, 1200, 1800, 2700, 3600, 7200],
        skipCostSurcharge: 1.2,                                       // übersprungene Stufen: Kosten +20 %
        skipTimeFactor: 2                                             // übersprungene Stufen: Zeit ×2
    },

    collector: {
        baseCost: { ants: 10, food: 100, larvae: 5 },
        // Steigerung gegenüber den Kosten des VORHERIGEN Sammlers, nach Sammlernummer
        costSteps: [
            { from: 2,     to: 10,       percent: 1 },
            { from: 11,    to: 20,       percent: 2 },
            { from: 21,    to: 30,       percent: 3 },
            { from: 31,    to: 40,       percent: 4 },
            { from: 41,    to: 100,      percent: 5 },
            { from: 101,   to: 250,      percent: 0.75 },
            { from: 251,   to: 500,      percent: 0.5 },
            { from: 501,   to: 1000,     percent: 0.25 },
            { from: 1001,  to: 2000,     percent: 0.125 },
            { from: 2001,  to: 5000,     percent: 0.075 },
            { from: 5001,  to: 10000,    percent: 0.05 },
            { from: 10001, to: 15000,    percent: 0.025 },
            { from: 15001, to: Infinity, percent: 0.01 }
        ],
        bonusPerCollector: 0, // bleibt ohne Forschungsstufen zunächst bei 0
        bonusPerCollectorPerResearchLevel: 0.001, // +0,1 Prozentpunkte je Sammler und Forschungsstufe
        maxBonusResearchLevel: 10,
        foodPerSecond: 1,
        trainingSecondsByCount: [
            { max: 25, seconds: 20 },
            { max: 50, seconds: 30 },
            { max: 75, seconds: 40 },
            { max: 100, seconds: 50 },
            { max: Infinity, seconds: 60 }
        ]
    },

    mushroomFarm: { foodPerSecond: 1, researchPerLevel: 0.5, maxResearchLevel: 8 },

    broodExpert: {
        // Kostenfaktor je Brutexpertin Nr. 1..5 (auf die bisherigen Grundkosten)
        costFactors: [1, 5, 10, 17.5, 35]
    },

    refunds: {   // feste Nahrungsgutschrift je gestorbener Einheit
        "normal-ant": 1,
        "queen": 10,
        "collector": 2,
        "scout": 3,
        "brood-expert": 15,
        "builder": 5,
        "storage-keeper": 8,
        "grand-nurse": 8
    },

    upkeep: {   // Nahrungsverbrauch pro Sekunde (Überlebensressource)
        "brood-expert": 5,
        "normal-ant": 0.5,               // vereinbart
        "queen": 1.0,                    // vereinbart
        "collector": 0.25,
        "storage-keeper": 5,
        "grand-nurse": 5
    },

    larvaeProductionPerQueen: 0.1,       // ÜBERNOMMEN

    /* ---------- ÜBERNOMMEN (bisheriger Code) ---------- */

    carriedOver: {
        queen: {
            baseFood: 500, foodScaling: 1.075,
            baseAnts: 1,   antsScaling: 1.05
        },
        scout: { cost: { ants: 50, food: 5000, larvae: 1000, queens: 1 }, maxCount: 1 },
        broodExpert: { baseCost: { ants: 100, food: 1000, larvae: 250, queens: 1 }, maxCount: 5 },
        storageKeeper: {
            baseCost: { ants: 150, food: 7500, larvae: 2000, queens: 1 },
            multiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
            maxCount: 5
        },
        grandNurse: {
            baseCost: { ants: 200, food: 7500, larvae: 2000, queens: 1 },
            multiplier: { ants: 2, food: 1.75, larvae: 1.5, queens: 2 },
            maxCount: 5
        },
        storageRoom: { cost: { larvae: 50, ants: 75, queens: 0, food: 1000 }, totalFoodCapacity: 10000 },
        broodChamber: { cost: { food: 1500, larvae: 75, ants: 100, queens: 0 }, totalLarvaeCapacity: 2500 }
    },

    /* ---------- VORLÄUFIG (wartet auf Freigabe) ---------- */

    provisional: {
        // Eine Larve wird zu genau einer Ameise.
        hatchCost: { larvae: 1 },

        housing: {
            baseCost: { food: 150 },
            buildSeconds: 10,
            capacityBonusPerLevel: 5,                 // Wohnraum je Wohnkammer: 10 + 5 × (Stufe − 1)
            // Nahrungskosten je Upgrade-Stufe 1→2 ... 9→10
            upgradeFood: [500, 1500, 4000, 10000, 25000, 60000, 150000, 400000, 1000000]
        },

        mushroomFarm: { baseCost: { food: 150 }, costGrowth: 1.10, buildSeconds: 10 },
        structureBuildSecondsByCount: [
            { max: 10, seconds: 10 },
            { max: 20, seconds: 15 },
            { max: 30, seconds: 20 },
            { max: 40, seconds: 25 },
            { max: 50, seconds: 30 },
            { max: 60, seconds: 35 },
            { max: 70, seconds: 40 },
            { max: 80, seconds: 45 },
            { max: 90, seconds: 50 },
            { max: 100, seconds: 55 },
            { max: Infinity, seconds: 60 }
        ],

        constructionChamber: { cost: { food: 1000, larvae: 75, ants: 50, queens: 1 }, buildSeconds: 600 },

        storageRoomBuildSeconds: 900,
        broodChamberBuildSeconds: 900,

        builder: {
            baseCost: { ants: 25, food: 1500, larvae: 150, queens: 1 },
            multiplier: { ants: 1.5, food: 1.5, larvae: 1.5, queens: 1.5 }
        },

        // Welche Projekte einen Baumeister benötigen (nur Wohnkammer-Upgrades sind vorgegeben)
        requiresBuilder: { housingBuild: false, housingUpgrade: true, mushroomFarm: false,
                           storageRoom: true, broodChamber: true, constructionChamber: false },

        // Forschungs-Freischaltung der 2.-5. Vorratshüterin / Groß-Amme ist noch nicht
        // implementiert: bis dahin ist nur die erste verfügbar.
        unlockedByResearch: { storageKeeper: 1, grandNurse: 1 },
        // Stufe der Baukammer, bis zu der ohne Forschung ausgebaut werden kann
        unlockedConstructionLevel: 1
    }
};
