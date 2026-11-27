/* =========================
    Brutkammer (Definition)
    Einmal baubar. Setzt die Larvenkapazität auf 2.500 INSGESAMT.
    Neun weitere Ausbaustufen erhöhen das Lager jeweils um 2.500.
    Forschung schaltet die Stufen einzeln frei. Kosten und Zeiten der Upgrades bleiben
    bis zur späteren Balance-Festlegung deaktiviert.
========================= */

const BROOD_CHAMBER_UPGRADE_MAX_LEVEL = 10;
const BROOD_CHAMBER_UPGRADE_INCREMENT = 2500;

function broodChamberCapacityAtLevel(level)
{
    return BALANCE.carriedOver.broodChamber.totalLarvaeCapacity
        + Math.max(0, Number(level || 1) - 1) * BROOD_CHAMBER_UPGRADE_INCREMENT;
}

StructureRegistry.register({
    id: "brood-chamber",
    nameKey: "structure.nursery.name",
    store: { section: "structures", key: "nurseryCount" },
    flagKey: "hasNursery",
    maxCount: 1,

    capacity: {
        resource: "larvae",
        total: () => broodChamberCapacityAtLevel(GameState.structures.broodChamberLevel)
    },
    capacityAtLevel: broodChamberCapacityAtLevel,

    requirement: () => GameState.achievements.smallColony ? null : { key: null },

    build: {
        requiresBuilder: BALANCE.provisional.requiresBuilder.broodChamber,
        getInfo: () => ({ cost: BALANCE.carriedOver.broodChamber.cost, seconds: BALANCE.provisional.broodChamberBuildSeconds / (1 - BALANCE.builder.reductionPerBuilder) })
    },

    upgrade: {
        configured: false,
        requiresBuilder: true,
        levelKey: "broodChamberLevel",
        maxLevel: BROOD_CHAMBER_UPGRADE_MAX_LEVEL,
        getUnlockedLevel: () => GameState.research.broodChamberUpgradeLevel || 1,
        getInfo: () => ({ cost: {}, seconds: 0 })
    }
});