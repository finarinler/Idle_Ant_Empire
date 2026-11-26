/* Erfolg: Tausend gekaufte Ameisen
   Gezählt werden bezahlte Käufe normaler Ameisen – nicht gefundene oder ausgebrütete.
*/
registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts1",
    order: 401,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 1
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts10",
    order: 402,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 10
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts50",
    order: 403,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 50
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts100",
    order: 404,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 100
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts250",
    order: 405,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 250
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts500",
    order: 406,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 500
    })
});

registerAchievement({
    category: "units",
    unitGroupOrder: 1,
    id: "purchasedAnts1000",
    order: 409,
    getProgress: () => ({
        current: GameState.stats.totalPurchasedAnts || 0,
        goal: 1000
    })
});
