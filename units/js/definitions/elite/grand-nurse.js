/* =========================
    Groß-Amme (Definition)
    Einzige Wirkung: verdoppelt die dann geltende Larvenlagerkapazität.
    Verbraucht 5 Nahrung/s (Überlebensressource). Kein Wohnraum. Maximal 5.
    Die Freischaltung der 2.-5. Groß-Amme erfolgt später über Forschung.
========================= */

UnitRegistry.register({
    id: "grand-nurse",
    nameKey: "unit.grandNurse.name",
    store: { kind: "number", section: "eliteUnits", key: "grandNurseCount" },
    housing: 0,
    maxCount: BALANCE.carriedOver.grandNurse.maxCount,
    unlockedCount: () => BALANCE.provisional.unlockedByResearch.grandNurse,

    consumption: [{ resource: "food", rate: BALANCE.upkeep["grand-nurse"], kind: "survival" }],
    production: [],
    capacityEffects: [{ resource: "larvae", type: "doubling" }],
    refund: { food: BALANCE.refunds["grand-nurse"] },

    requirement: () => (GameState.structures.storageCount > 0 && GameState.structures.nurseryCount > 0)
        ? null
        : { key: "status.elite.requirements" },

    recruit: {
        getCost: () => getScaledCost(
            BALANCE.carriedOver.grandNurse.baseCost,
            BALANCE.carriedOver.grandNurse.multiplier,
            GameState.eliteUnits.grandNurseCount || 0
        ),
        announce: true,
        messageKey: "status.grandNurse.trained"
    }
});
