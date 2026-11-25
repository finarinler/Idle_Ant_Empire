/* =========================
    Späher (Definition)
    Maximal 1, Wohnraum 5. Gekauft wird im Expeditionsfenster.
    ON automatisiert das bestehende Expeditionssystem, OFF lässt die manuelle Bedienung unverändert.
    Expeditionen laufen offline nicht.
========================= */

UnitRegistry.register({
    id: "scout",
    nameKey: "unit.scout.name",
    store: { kind: "number", section: "eliteUnits", key: "scoutCount" },
    housing: 5,
    maxCount: BALANCE.carriedOver.scout.maxCount,

    consumption: [],
    production: [],
    refund: { food: BALANCE.refunds["scout"] },

    requirement: () => GameState.achievements.expeditionCommander
        ? null
        : { key: "status.scout.needAchievement", params: { achievement: { key: "achievement.expeditionCommander.title" } } },

    recruit: {
        getCost: () => BALANCE.carriedOver.scout.cost,
        announce: true,
        messageKey: "status.scout.trained"
    }
});
