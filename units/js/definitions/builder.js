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

    consumption: [{ resource: "food", rate: () => 5 * (GameState.eliteUnits.builderCount || 0) }],
    production: [],
    refund: { food: BALANCE.refunds["builder"] },

    requirement: () => GameState.structures.constructionLevel > 0 ? null : { key: "status.requires.constructionChamber" },

    recruit: {
        getCost: () =>
        {
            const count = GameState.eliteUnits.builderCount || 0;

            // Nur Baumeister Nr. 1 erhält den einmaligen Einstiegspreis.
            // Ab Nr. 2 bleiben Grundkosten und Multiplikatoren exakt unverändert.
            if (count === 0)
            {
                return { ants: 25, food: 750, larvae: 100, queens: 1 };
            }

            return getScaledCost(
                BALANCE.provisional.builder.baseCost,
                BALANCE.provisional.builder.multiplier,
                count
            );
        },
        announce: true,
        messageKey: "status.builder.trained"
    }
});
