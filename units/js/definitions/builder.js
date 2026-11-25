/* =========================
    Baumeister (Definition)
    Maximal 10, benötigt die Baukammer; die Baukammerstufe begrenzt die Anzahl.
    Jeder Baumeister verkürzt Bauzeiten um 5 % (max. 50 %). Kein Wohnraum.
    Rekrutierungskosten: VORLÄUFIG.
========================= */

UnitRegistry.register({
    id: "builder",
    nameKey: "unit.builder.name",
    store: { kind: "number", section: "eliteUnits", key: "builderCount" },
    housing: 0,
    maxCount: () => Math.min(BALANCE.builder.maxBuilders, GameState.structures.constructionLevel),

    consumption: [],
    production: [],
    refund: { food: BALANCE.refunds["builder"] },

    requirement: () => GameState.structures.constructionLevel > 0 ? null : { key: "status.requires.constructionChamber" },

    recruit: {
        getCost: () => getScaledCost(
            BALANCE.provisional.builder.baseCost,
            BALANCE.provisional.builder.multiplier,
            GameState.eliteUnits.builderCount || 0
        ),
        announce: true,
        messageKey: "status.builder.trained"
    }
});
