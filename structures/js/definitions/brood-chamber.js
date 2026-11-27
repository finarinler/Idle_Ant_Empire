/* =========================
    Brutkammer (Definition)
    Einmal baubar. Setzt die Larvenkapazität auf 2.500 INSGESAMT.
    Neun weitere Ausbaustufen erhöhen die Brutkapazität jeweils um 2.500.
    Forschung schaltet die Stufen einzeln frei. Kosten und Bauzeiten stehen zentral in
    BALANCE.provisional.capacityUpgrade.
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
        configured: true,
        requiresBuilder: true,
        levelKey: "broodChamberLevel",
        maxLevel: BROOD_CHAMBER_UPGRADE_MAX_LEVEL,
        getUnlockedLevel: () => GameState.research.broodChamberUpgradeLevel || 1,
        getInfo: targetLevel => {
            const from = GameState.structures.broodChamberLevel;
            const to = Math.max(from + 1, Math.min(BROOD_CHAMBER_UPGRADE_MAX_LEVEL, targetLevel || from + 1));
            let food = 0, seconds = 0;
            for (let level = from; level < to; level++) {
                food += BALANCE.provisional.capacityUpgrade.upgradeFood[level - 1];
                seconds += BALANCE.provisional.capacityUpgrade.upgradeSeconds[level - 1];
            }
            return { cost: { food: Big(food) }, seconds };
        }
    }
});