/* =========================
   Neue Erfolge und EP-Meilensteine
   Prestige-Erfolge und PP-System sind hier ausdrücklich nicht enthalten.
========================= */

const NEW_NORMAL_ACHIEVEMENTS = [
    { id: "foodReserve1000", category: "collect", order: 500, epReward: 10, goal: 1000, getCurrent: () => GameState.resources.food },
    { id: "foodReserve10000", category: "collect", order: 501, epReward: 15, goal: 10000, getCurrent: () => GameState.resources.food },
    { id: "larvaeReserve100", category: "units", unitGroupOrder: 3, order: 502, epReward: 10, goal: 100, getCurrent: () => GameState.resources.larvae },
    { id: "larvaeReserve500", category: "units", unitGroupOrder: 3, order: 503, epReward: 15, goal: 500, getCurrent: () => GameState.resources.larvae },
    { id: "queenCourt250", category: "units", unitGroupOrder: 2, order: 504, epReward: 20, goal: 250, getCurrent: () => GameState.resources.queens },
    { id: "queenEmpire500", category: "units", unitGroupOrder: 2, order: 505, epReward: 25, goal: 500, getCurrent: () => GameState.resources.queens },
    { id: "collectorHarvest500", category: "units", unitGroupOrder: 4, order: 506, epReward: 15, goal: 500, getCurrent: () => GameState.resources.collectors },
    { id: "collectorHarvest1000", category: "units", unitGroupOrder: 4, order: 507, epReward: 20, goal: 1000, getCurrent: () => GameState.resources.collectors },
    { id: "mushroomFarmSettlement500", category: "build", order: 508, epReward: 20, goal: 500, getCurrent: () => GameState.structures.mushroomFarmCount },
    { id: "mushroomFarmMetropolis1000", category: "build", order: 509, epReward: 25, goal: 1000, getCurrent: () => GameState.structures.mushroomFarmCount },
    { id: "purchasedAnts2000", category: "units", unitGroupOrder: 1, order: 510, epReward: 20, goal: 2000, getCurrent: () => GameState.stats.totalPurchasedAnts || 0 },
    { id: "purchasedAnts5000", category: "units", unitGroupOrder: 1, order: 511, epReward: 25, goal: 5000, getCurrent: () => GameState.stats.totalPurchasedAnts || 0 },
    { id: "expeditionColony2500", category: "expedition", order: 512, epReward: 20, goal: 2500, getCurrent: () => GameState.stats.expeditionsCount },
    { id: "expeditionWorld5000", category: "expedition", order: 513, epReward: 25, goal: 5000, getCurrent: () => GameState.stats.expeditionsCount },
    { id: "criticalFortune500", category: "expedition", order: 514, epReward: 20, goal: 500, getCurrent: () => GameState.stats.criticalExpeditionsCount },
    { id: "criticalFortune1000", category: "expedition", order: 515, epReward: 30, goal: 1000, getCurrent: () => GameState.stats.criticalExpeditionsCount },
    { id: "colonyRescuer25", category: "expedition", order: 516, epReward: 15, goal: 25, getCurrent: () => GameState.stats.expeditionAntsFound }
];

NEW_NORMAL_ACHIEVEMENTS.forEach(item =>
{
    registerAchievement({
        id: item.id,
        category: item.category,
        unitGroupOrder: item.unitGroupOrder,
        order: item.order,
        epReward: item.epReward,
        getProgress: () => ({ current: item.getCurrent(), goal: item.goal })
    });
});

const EP_MILESTONE_ACHIEVEMENTS = [
    { id: "epFirstSpark5", order: 700, goal: 5 },
    { id: "epMore10", order: 701, goal: 10 },
    { id: "epOnTrack25", order: 702, goal: 25 },
    { id: "epSmallTreasure50", order: 703, goal: 50 },
    { id: "epSuccessful100", order: 704, goal: 100 },
    { id: "epBigStep250", order: 705, goal: 250 },
    { id: "epCollector500", order: 706, goal: 500 },
    { id: "epLegend1000", order: 707, goal: 1000 }
];

EP_MILESTONE_ACHIEVEMENTS.forEach(item =>
{
    registerAchievement({
        id: item.id,
        category: "ep",
        order: item.order,
        epReward: 0,
        permanent: true,
        getProgress: () => ({
            current: GameState.stats.totalAchievementPointsEarned || 0,
            goal: item.goal
        })
    });
});
