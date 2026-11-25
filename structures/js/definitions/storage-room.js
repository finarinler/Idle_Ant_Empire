/* =========================
    Vorratskammer (Definition)
    Einmal baubar. Setzt die Nahrungskapazität auf 10.000 INSGESAMT (ersetzt die Grundkapazität,
    wird nicht zusätzlich addiert). Keine Upgrades. Überschüssige Nahrung verfällt.
    Kosten: aus dem bisherigen Code. Bauzeit: VORLÄUFIG.
========================= */

StructureRegistry.register({
    id: "storage-room",
    nameKey: "structure.storage.name",
    store: { section: "structures", key: "storageCount" },
    flagKey: "hasStorage",
    maxCount: 1,

    capacity: { resource: "food", total: BALANCE.carriedOver.storageRoom.totalFoodCapacity },

    requirement: () => GameState.achievements.smallColony ? null : { key: null },

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.storageRoom,
        getInfo: () => ({ cost: BALANCE.carriedOver.storageRoom.cost, seconds: BALANCE.provisional.storageRoomBuildSeconds })
    }
});
