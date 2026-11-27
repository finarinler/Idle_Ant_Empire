    CardBuilder.register("structures-upgrades", [
        {
            id: "housing-upgrade",
            icon: "⇧",
            type: { key: "card.type.structureUpgrade" },
            name: { key: "structure.housingUpgrade.name" },
            desc: { key: "structure.housingUpgrade.desc" },
            count: { value: () => GameState.structures.housingLevel, max: BALANCE.housing.maxLevel },
            stats: [
                { label: { key: "card.stat.perChamber" }, value: () => `${formatGameNumber(Economy.getHousingPerChamber())} → ${formatGameNumber(StructureRegistry.get("housing-chamber").housingCapacity(clampHousingTarget()))}`, tone: "positive" },
                {
                    label: { key: "card.stat.buildTime" },
                    value: () => GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                        ? "—"
                        : formatDuration(Economy.getProjectInfo("housing-chamber", "upgrade", clampHousingTarget()).seconds)
                },
                { label: { key: "card.stat.needsBuilder" }, value: { key: "card.value.yes" } }
            ],
            stepper: {
                label: () => ({ key: "structure.housingUpgrade.target", params: { level: clampHousingTarget() } }),
                canDec: () => clampHousingTarget() > GameState.structures.housingLevel + 1,
                canInc: () => clampHousingTarget() < BALANCE.housing.maxLevel,
                dec: () => { housingUpgradeTarget--; CardBuilder.updateAll(); },
                inc: () => { housingUpgradeTarget++; CardBuilder.updateAll(); }
            },
            progressId: "progress-housing-upgrade",
            cost: () => ({
                values: GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                    ? {}
                    : Economy.getProjectInfo("housing-chamber", "upgrade", clampHousingTarget()).cost,
                order: ["food"]
            }),
            action: {
                label: { key: "button.upgrade" },
                missingLabel: { key: "button.upgrade" },
                run: () => startStructureProject("housing-chamber", "upgrade", clampHousingTarget())
            },
            status: () => GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                ? { state: "max", hint: { key: "status.elite.maxReached" } }
                : projectStatus("housing-chamber", "upgrade", clampHousingTarget())
        }

        createCapacityUpgradeCard({
            id: "storage-room-upgrade",
            structureId: "storage-room",
            levelKey: "storageRoomLevel",
            maxLevel: 10,
            nameKey: "structure.storageUpgrade.name",
            descKey: "structure.storageUpgrade.desc",
            capacityLabel: "card.stat.foodLimit",
            resource: "food"
        }),
        createCapacityUpgradeCard({
            id: "brood-chamber-upgrade",
            structureId: "brood-chamber",
            levelKey: "broodChamberLevel",
            maxLevel: 10,
            nameKey: "structure.broodUpgrade.name",
            descKey: "structure.broodUpgrade.desc",
            capacityLabel: "card.stat.larvaeLimit",
            resource: "larvae"
        }),
,
        createCapacityUpgradeCard({
            id: "storage-room-upgrade",
            structureId: "storage-room",
            levelKey: "storageRoomLevel",
            maxLevel: 10,
            nameKey: "structure.storageUpgrade.name",
            descKey: "structure.storageUpgrade.desc",
            capacityLabel: "card.stat.foodLimit",
            resource: "food"
        }),
        createCapacityUpgradeCard({
            id: "brood-chamber-upgrade",
            structureId: "brood-chamber",
            levelKey: "broodChamberLevel",
            maxLevel: 10,
            nameKey: "structure.broodUpgrade.name",
            descKey: "structure.broodUpgrade.desc",
            capacityLabel: "card.stat.larvaeLimit",
            resource: "larvae"
        }),

    ]);
})();
