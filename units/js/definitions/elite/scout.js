/* =========================
    Späher (Definition)
    Maximal 1, Wohnraum 5. Wird unter Elite-Einheiten ausgebildet.
    ON automatisiert das bestehende Expeditionssystem, OFF lässt die manuelle Bedienung unverändert.
    Expeditionen laufen offline nicht.
========================= */

UnitRegistry.register({
    id: "scout",
    nameKey: "unit.scout.name",
    store: { kind: "number", section: "eliteUnits", key: "scoutCount" },
    housing: 5,
    maxCount: BALANCE.carriedOver.scout.maxCount,

    // 18 Nahrung pro Minute = 0,3 Nahrung/s; bei deaktivierter Automatik 0,1 Nahrung/s.
    consumption: [{ resource: "food", rate: () => 0.3 * (GameState.expedition.scoutEnabled === false ? 1 / 3 : 1), kind: "survival" }],
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
