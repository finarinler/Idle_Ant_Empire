/* =========================
    Vorratshüterin (Definition)
    Einzige Wirkung: verdoppelt die dann geltende Nahrungslagerkapazität.
    Verbraucht 5 Nahrung/s (Überlebensressource). Kein Wohnraum. Maximal 5.
    Die Freischaltung der 2.-5. Vorratshüterin erfolgt später über Forschung
    (bis dahin: BALANCE.provisional.unlockedByResearch).
    Kosten: bisherige Kosten aus dem Code (Kosten-Neuordnung steht aus).
========================= */

UnitRegistry.register({
    id: "storage-keeper",
    nameKey: "unit.storageGuardian.name",
    store: { kind: "number", section: "eliteUnits", key: "storageGuardianCount" },
    housing: 0,
    maxCount: BALANCE.carriedOver.storageKeeper.maxCount,
    unlockedCount: () => BALANCE.provisional.unlockedByResearch.storageKeeper,

    consumption: [{ resource: "food", rate: BALANCE.upkeep["storage-keeper"], kind: "survival" }],
    production: [],
    capacityEffects: [{ resource: "food", type: "doubling" }],
    refund: { food: BALANCE.refunds["storage-keeper"] },

    requirement: () => (GameState.structures.storageCount > 0 && GameState.structures.nurseryCount > 0)
        ? null
        : { key: "status.elite.requirements" },

    recruit: {
        getCost: () => getScaledCost(
            BALANCE.carriedOver.storageKeeper.baseCost,
            BALANCE.carriedOver.storageKeeper.multiplier,
            GameState.eliteUnits.storageGuardianCount || 0
        ),
        announce: true,
        messageKey: "status.storageGuardian.trained"
    }
});
