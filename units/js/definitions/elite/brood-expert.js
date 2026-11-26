/* =========================
    Brutexpertin (Definition)
    Maximal 5, benötigt die Brutkammer, Wohnraum 3 je Brutexpertin.
    Schlüpft immer nur EINE Ameise gleichzeitig. Die Schlupfzeit hängt von der
    Anzahl der Brutexpertinnen ab. Ohne freien Wohnraum wartet der Schlupf.
    Einmalige Schlupfkosten werden beim Start des Schlupfs abgezogen (VORLÄUFIG).
========================= */

UnitRegistry.register({
    id: "brood-expert",
    nameKey: "unit.broodExpert.name",
    store: { kind: "number", section: "eliteUnits", key: "broodExpertCount" },
    housing: 3,
    maxCount: BALANCE.carriedOver.broodExpert.maxCount,

    consumption: [],
    production: [],
    refund: { food: BALANCE.refunds["brood-expert"] },

    requirement: () => GameState.structures.nurseryCount > 0 ? null : { key: "status.requires.broodChamber" },

    // Kostenfaktor Nr. 1..5 auf die bisherigen Grundkosten; jede Ressource aufgerundet
    recruit: {
        getCost: () =>
        {
            const factors = BALANCE.broodExpert.costFactors;
            const index = Math.min(GameState.eliteUnits.broodExpertCount || 0, factors.length - 1);

            return getFactoredCost(BALANCE.carriedOver.broodExpert.baseCost, factors[index]);
        },
        announce: true,
        messageKey: "status.broodExpert.trained"
    },

    hatch: {
        cost: BALANCE.provisional.hatchCost,
        getSeconds: experts => BALANCE.hatchSecondsByExperts[Math.max(1, Math.min(5, Math.floor(experts)))]
    }
});
