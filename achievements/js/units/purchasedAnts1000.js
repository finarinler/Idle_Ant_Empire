/* Erfolg: Tausend gekaufte Ameisen
   Gezählt werden bezahlte Käufe normaler Ameisen – nicht gefundene oder ausgebrütete.
*/
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
