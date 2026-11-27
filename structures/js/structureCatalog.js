/* =========================================================
    Gebäude-Katalog
    Zentrale Definition aller Gebäude-Karten (Daten und Aktionen).
    Die Darstellung übernimmt der gemeinsame CardBuilder.
    Konfiguration: structures/js/definitions/*.js · Bau: structureActions.js · Rechnung: core/economy
========================================================= */

(() =>
{
    "use strict";

    const SECOND = () => I18N.t("statistics.unit.second");
    const COST_ORDER = ["larvae", "ants", "queens", "food"];

    const totalProductionStat = resource => ({
        label: { key: "card.stat.totalProduction" },
        value: () =>
        {
            const total = Economy.computeFlows().produced[resource].roundTo(1);
            const abbreviation = resource === "food" ? "F" : "L";
            return `${total.isPositive() ? "+" : ""}${formatRate(total)} [[${abbreviation}]]/s`;
        },
        tone: "positive"
    });

    const buildAction = (structureId) => ({
        label: { key: "button.build" },
        missingLabel: { key: "button.build" },
        preview: { kind: "structure", id: structureId },
        batchOptions: () => Economy.getProjectBatchOptions(structureId),
        batchRun: amount => startStructureProjectBatch(structureId, amount),
        run: () => startStructureProject(structureId, "build")
    });

    // Status direkt aus der Wirtschaft; bei laufendem Projekt wird die Restzeit angezeigt
    function projectStatus(structureId, kind, targetLevel)
    {
        const state = Economy.getProjectState(structureId, kind, targetLevel);

        if (state.hint && state.hint.key === "status.build.inProgress")
        {
            const project = Economy.getProject(structureId, kind);
            return { state: state.state, hint: { key: state.hint.key, params: { time: formatDuration(project ? project.remaining : 0) } } };
        }

        return { state: state.state, hint: state.hint };
    }

    const buildCost = (structureId, order) => () => ({
        values: Economy.getProjectInfo(structureId, "build").cost,
        order: order || COST_ORDER
    });

    const buildTimeStat = (structureId, kind, target) => ({
        label: { key: "card.stat.buildTime" },
        value: () => `${formatDuration(Economy.getProjectInfo(structureId, kind, target ? target() : undefined).seconds)}`
    });

    // Wohnkammern werden ausschließlich um genau eine Stufe pro Ausbau verbessert.
    function getNextHousingUpgradeTarget()
    {
        return Math.min(BALANCE.housing.maxLevel, GameState.structures.housingLevel + 1);
    }

    // Karten für Kapazitäts-Upgrades von Vorrats- und Brutkammer.
    function createCapacityUpgradeCard(config)
    {
        const getLevel = () => Number(GameState.structures[config.levelKey] || 1);
        const getTarget = () => Math.min(config.maxLevel, getLevel() + 1);
        return {
            id: config.id,
            icon: "⇧",
            type: { key: "card.type.structureUpgrade" },
            name: { key: config.nameKey },
            desc: { key: config.descKey },
            count: { value: () => Math.max(0, getLevel() - 1), max: config.maxLevel - 1 },
            stats: [
                { label: { key: config.capacityLabel }, value: () => { const def = StructureRegistry.get(config.structureId); return formatGameNumber(def.capacityAtLevel(getLevel())) + " → " + formatGameNumber(def.capacityAtLevel(getTarget())); }, tone: "positive" },
                { label: { key: "card.stat.buildTime" }, value: () => formatDuration(Economy.getProjectInfo(config.structureId, "upgrade", getTarget()).seconds) },
                { label: { key: "card.stat.needsBuilder" }, value: { key: "card.value.yes" } }
            ],
            cost: () => ({ values: Economy.getProjectInfo(config.structureId, "upgrade", getTarget()).cost, order: [config.resource] }),
            action: { label: { key: "button.upgrade" }, missingLabel: { key: "button.upgrade" }, run: () => startStructureProject(config.structureId, "upgrade", getTarget()) },
            status: () => projectStatus(config.structureId, "upgrade", getTarget())
        };
    }
    CardBuilder.register("structures-basic", [
        {
            id: "housing",
            icon: "⌂",
            type: { key: "card.type.structureBasic" },
            name: { key: "structure.housing.name" },
            desc: { key: "structure.housing.desc" },
            count: { value: () => GameState.structures.housingCount },
            stats: [
                { label: { key: "card.stat.housing" }, value: () => `${formatGameNumber(Economy.getHousingUsed())} / ${formatGameNumber(Economy.getHousingCapacity())}`, tone: "positive" },
                { label: { key: "card.stat.perChamber" }, value: () => formatGameNumber(Economy.getHousingPerChamber()) },
                buildTimeStat("housing-chamber", "build")
            ],
            progressId: "progress-housing",
            cost: buildCost("housing-chamber", ["food"]),
            action: buildAction("housing-chamber"),
            status: () => projectStatus("housing-chamber", "build")
        },
        {
            id: "mushroom-farm",
            icon: "❀",
            type: { key: "card.type.structureBasic" },
            name: { key: "structure.mushroomFarm.name" },
            desc: { key: "structure.mushroomFarm.desc" },
            count: { value: () => GameState.structures.mushroomFarmCount },
            stats: [
                { label: { key: "card.stat.foodProduction" }, value: () => `+${formatDecimal(BALANCE.mushroomFarm.foodPerSecond, 0)} [[F]]/s`, tone: "positive" },
                { label: { key: "card.stat.mushroomFarmTotalBonus" }, value: () => `+${formatDecimal(Economy.modifiers.getProductionBonus("mushroom-farm", "food") * 100, 1)} %`, tone: "positive" },
                totalProductionStat("food"),
                buildTimeStat("mushroom-farm", "build")
            ],
            progressId: "progress-mushroom",
            cost: buildCost("mushroom-farm", ["food"]),
            action: buildAction("mushroom-farm"),
            status: () => projectStatus("mushroom-farm", "build")
        },
        {
            id: "royal-chamber",
            icon: "♕",
            type: { key: "card.type.structureBasic" },
            name: { key: "structure.royalChamber.name" },
            desc: { key: "structure.royalChamber.desc" },
            cost: "???",
            action: { label: { key: "button.locked" } },
            status: () => ({ state: "soon", hint: { key: "card.hint.soon" } })
        }
    ]);

    CardBuilder.register("structures-elite", [
        {
            id: "construction",
            icon: "⚒",
            type: { key: "card.type.structureElite" },
            name: { key: "structure.construction.name" },
            desc: { key: "structure.construction.desc" },
            count: { value: () => GameState.structures.constructionLevel, max: BALANCE.builder.maxBuilders },
            stats: [
                { label: { key: "card.stat.builderLimit" }, value: () => formatGameNumber(GameState.structures.constructionLevel), tone: "positive" },
                buildTimeStat("construction-chamber", "build")
            ],
            progressId: "progress-construction",
            cost: buildCost("construction-chamber"),
            action: buildAction("construction-chamber"),
            status: () => projectStatus("construction-chamber", "build")
        },
        {
            id: "storage",
            icon: "⌂",
            type: { key: "card.type.structureElite" },
            name: { key: "structure.storage.name" },
            desc: { key: "structure.storage.desc" },
            count: { value: () => GameState.structures.storageCount, max: 1 },
            stats: [
                { label: { key: "card.stat.foodLimit" }, value: () => formatGameNumber(BALANCE.carriedOver.storageRoom.totalFoodCapacity), tone: "positive" },
                buildTimeStat("storage-room", "build")
            ],
            progressId: "progress-storage",
            cost: buildCost("storage-room", ["larvae", "ants", "food"]),
            action: buildAction("storage-room"),
            status: () => projectStatus("storage-room", "build")
        },
        {
            id: "nursery",
            icon: "⌂",
            type: { key: "card.type.structureElite" },
            name: { key: "structure.nursery.name" },
            desc: { key: "structure.nursery.desc" },
            count: { value: () => GameState.structures.nurseryCount, max: 1 },
            stats: [
                { label: { key: "card.stat.larvaeLimit" }, value: () => formatGameNumber(BALANCE.carriedOver.broodChamber.totalLarvaeCapacity), tone: "positive" },
                buildTimeStat("brood-chamber", "build")
            ],
            progressId: "progress-nursery",
            cost: buildCost("brood-chamber", ["larvae", "ants", "food"]),
            action: buildAction("brood-chamber"),
            status: () => projectStatus("brood-chamber", "build")
        }
    ]);

    CardBuilder.register("structures-upgrades", [
        {
            id: "housing-upgrade",
            icon: "⇧",
            type: { key: "card.type.structureUpgrade" },
            name: { key: "structure.housingUpgrade.name" },
            desc: { key: "structure.housingUpgrade.desc" },
            count: { value: () => Math.max(0, GameState.structures.housingLevel - 1), max: BALANCE.housing.maxLevel - 1 },
            stats: [
                { label: { key: "card.stat.perChamber" }, value: () => `${formatGameNumber(Economy.getHousingPerChamber())} → ${formatGameNumber(StructureRegistry.get("housing-chamber").housingCapacity(getNextHousingUpgradeTarget()))}`, tone: "positive" },
                {
                    label: { key: "card.stat.buildTime" },
                    value: () => GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                        ? "—"
                        : formatDuration(Economy.getProjectInfo("housing-chamber", "upgrade", getNextHousingUpgradeTarget()).seconds)
                },
                { label: { key: "card.stat.needsBuilder" }, value: { key: "card.value.yes" } }
            ],
            progressId: "progress-housing-upgrade",
            cost: () => ({
                values: GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                    ? {}
                    : Economy.getProjectInfo("housing-chamber", "upgrade", getNextHousingUpgradeTarget()).cost,
                order: ["food"]
            }),
            action: {
                label: { key: "button.upgrade" },
                missingLabel: { key: "button.upgrade" },
                run: () => startStructureProject("housing-chamber", "upgrade", getNextHousingUpgradeTarget())
            },
            status: () => GameState.structures.housingLevel >= BALANCE.housing.maxLevel
                ? { state: "max", hint: { key: "status.elite.maxReached" } }
                : projectStatus("housing-chamber", "upgrade", getNextHousingUpgradeTarget())
        },
        createCapacityUpgradeCard({ id: "storage-room-upgrade", structureId: "storage-room", levelKey: "storageRoomLevel", maxLevel: 10, nameKey: "structure.storageUpgrade.name", descKey: "structure.storageUpgrade.desc", capacityLabel: "card.stat.foodLimit", resource: "food" }),
        createCapacityUpgradeCard({ id: "brood-chamber-upgrade", structureId: "brood-chamber", levelKey: "broodChamberLevel", maxLevel: 10, nameKey: "structure.broodUpgrade.name", descKey: "structure.broodUpgrade.desc", capacityLabel: "card.stat.larvaeLimit", resource: "larvae" })
    ]);
})();
