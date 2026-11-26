/* =========================
    Brutexpertin (Definition)
    Maximal 5, benötigt die Brutkammer, Wohnraum 3 je Brutexpertin.
    Schlüpft immer nur EINE Ameise gleichzeitig. Eine Larve ergibt eine Ameise.
    Jede Brut-Expertin verbraucht 5 Nahrung/s (ausgeschaltet: 2,5 Nahrung/s). Die Schlupfzeit hängt von
    der Anzahl der Brut-Expertinnen ab. Ohne freien Wohnraum wartet der Schlupf.
========================= */

UnitRegistry.register({
    id: "brood-expert",
    nameKey: "unit.broodExpert.name",
    store: { kind: "number", section: "eliteUnits", key: "broodExpertCount" },
    housing: 3,
    maxCount: BALANCE.carriedOver.broodExpert.maxCount,

    consumption: [{ resource: "food", rate: () => BALANCE.upkeep["brood-expert"] * (GameState.economy.broodExpertEnabled === false ? 0.5 : 1), kind: "survival" }],
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
