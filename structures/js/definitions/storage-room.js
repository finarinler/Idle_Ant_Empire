/* =========================
    Vorratskammer (Definition)
    Einmal baubar. Setzt die Nahrungskapazität auf 10.000 INSGESAMT.
    Neun weitere Ausbaustufen erhöhen das Lager jeweils um 10.000.
    Forschung schaltet die Stufen einzeln frei. Kosten und Zeiten der Upgrades bleiben
    bis zur späteren Balance-Festlegung deaktiviert.
========================= */

const STORAGE_ROOM_UPGRADE_MAX_LEVEL = 10;
const STORAGE_ROOM_UPGRADE_INCREMENT = 10000;

function storageRoomCapacityAtLevel(level)
{
    return BALANCE.carriedOver.storageRoom.totalFoodCapacity
        + Math.max(0, Number(level || 1) - 1) * STORAGE_ROOM_UPGRADE_INCREMENT;
}

StructureRegistry.register({
    id: "storage-room",
    nameKey: "structure.storage.name",
    store: { section: "structures", key: "storageCount" },
    flagKey: "hasStorage",
    maxCount: 1,

    capacity: {
        resource: "food",
        total: () => storageRoomCapacityAtLevel(GameState.structures.storageRoomLevel)
    },
    capacityAtLevel: storageRoomCapacityAtLevel,

    requirement: () => GameState.achievements.smallColony ? null : { key: null },

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.storageRoom,
        getInfo: () => ({ cost: BALANCE.carriedOver.storageRoom.cost, seconds: BALANCE.provisional.storageRoomBuildSeconds / (1 - BALANCE.builder.reductionPerBuilder) })
    },

    upgrade: {
        configured: false,
        requiresBuilder: true,
        levelKey: "storageRoomLevel",
        maxLevel: STORAGE_ROOM_UPGRADE_MAX_LEVEL,
        getUnlockedLevel: () => GameState.research.storageRoomUpgradeLevel || 1,
        getInfo: () => ({ cost: {}, seconds: 0 })
    }
});