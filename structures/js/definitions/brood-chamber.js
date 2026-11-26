/* =========================
    Brutkammer (Definition)
    Einmal baubar, keine Upgrades. Schaltet Brutexpertinnen frei und setzt die Larvenkapazität
    auf 2.500 INSGESAMT (ersetzt die Grundkapazität, wird nicht zusätzlich addiert).
    Kosten: aus dem bisherigen Code. Bauzeit: VORLÄUFIG.
========================= */

StructureRegistry.register({
    id: "brood-chamber",
    nameKey: "structure.nursery.name",
    store: { section: "structures", key: "nurseryCount" },
    flagKey: "hasNursery",
    maxCount: 1,

    capacity: { resource: "larvae", total: BALANCE.carriedOver.broodChamber.totalLarvaeCapacity },

    requirement: () => GameState.achievements.smallColony ? null : { key: null },

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.broodChamber,
        getInfo: () => ({ cost: BALANCE.carriedOver.broodChamber.cost, seconds: BALANCE.provisional.broodChamberBuildSeconds / (1 - BALANCE.builder.reductionPerBuilder) })
    }
});
