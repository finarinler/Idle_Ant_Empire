/* =========================
    Pilzfarm (Definition)
    Start: 0. Jede Pilzfarm produziert 5 Nahrung/s. Keine Maximalzahl.
    Der Sammlerbonus (+1 % je Sammler, additiv) wirkt auf die Gesamtproduktion ALLER Pilzfarmen.
    Gebäude behalten ihre volle Basis-Effizienz.
    Kosten, Kostensteigerung, Bauzeit: VORLÄUFIG.
========================= */

StructureRegistry.register({
    id: "mushroom-farm",
    nameKey: "structure.mushroomFarm.name",
    store: { section: "structures", key: "mushroomFarmCount" },

    production: [{ resource: "food", rate: BALANCE.mushroomFarm.foodPerSecond }],

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.mushroomFarm,
        getInfo: () =>
        {
            const config = BALANCE.provisional.mushroomFarm;
            const factor = Big(config.costGrowth).pow(GameState.structures.mushroomFarmCount);

            const nextFarm = GameState.structures.mushroomFarmCount + 1;
            const seconds = BALANCE.getCountBasedSeconds(nextFarm, BALANCE.provisional.structureBuildSecondsByCount);
            return { cost: { food: Big(config.baseCost.food).mul(factor) }, seconds };
        }
    }
});
