/* =========================
    Baukammer (Definition)
    Voraussetzung für Baumeister. Stufe 1 erlaubt 1 Baumeister, jede weitere Stufe einen weiteren
    (maximal Stufe 10). Höhere Stufen werden später über Forschung freigeschaltet; bis dahin
    ist nur Stufe 1 verfügbar (BALANCE.provisional.unlockedConstructionLevel).
    Kosten und Bauzeit: VORLÄUFIG.
========================= */

StructureRegistry.register({
    id: "construction-chamber",
    nameKey: "structure.construction.name",
    store: { section: "structures", key: "constructionLevel" },
    // Die nächste Baukammer wird erst nach ihrer jeweiligen Forschung freigeschaltet.
    maxCount: () => Math.min(BALANCE.builder.maxBuilders, Math.max(1, Number(GameState.research.constructionChamberLevel) || 1)),

    requirement: () => GameState.achievements.smallColony ? null : { key: null },

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.constructionChamber,
        getInfo: () => ({
            cost: BALANCE.provisional.constructionChamber.cost,
            seconds: BALANCE.provisional.constructionChamber.buildSecondsByCount[Math.min(BALANCE.builder.maxBuilders, Economy.getStructureNumber("construction-chamber") + 1) - 1]
        })
    }
});
