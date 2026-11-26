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

    const buildAction = (structureId) => ({
        label: { key: "button.build" },
        missingLabel: { key: "button.build" },
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

    // Zielstufe des globalen Wohnkammer-Upgrades (Überspringen erlaubt)
    let housingUpgradeTarget = 2;

    function clampHousingTarget()
    {
        const level = GameState.structures.housingLevel;
        const max = BALANCE.housing.maxLevel;

        housingUpgradeTarget = Math.max(level + 1, Math.min(max, housingUpgradeTarget));
        return housingUpgradeTarget;
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
            id: "housing-upgrade",
            startsHidden: true,
            visible: () => Boolean(GameState.achievements.knowledgeIsPower),
            icon: "⇧",
            type: { key: "card.type.structureBasic" },
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
                { label: { key: "card.stat.mushroomBonus" }, value: () => `+${formatDecimal((Economy.getUnitNumber("collector") * BALANCE.collector.bonusPerCollector + (GameState.achievements.collectorTwoFifty ? 0.10 : GameState.achievements.collectorHundred ? 0.075 : GameState.achievements.collectorFifty ? 0.05 : GameState.achievements.collectorTwentyFive ? 0.025 : GameState.achievements.collectorTen ? 0.01 : 0) + (GameState.achievements.mushroomFarmTwoFifty ? 0.25 : GameState.achievements.mushroomFarmHundred ? 0.20 : GameState.achievements.mushroomFarmFifty ? 0.15 : GameState.achievements.mushroomFarmTwentyFive ? 0.10 : GameState.achievements.mushroomFarmTen ? 0.01 : 0)) * 100, 1)} %`, tone: "positive" },
                buildTimeStat("mushroom-farm", "build")
            ],
            progressId: "progress-mushroom",
            cost: buildCost("mushroom-farm", ["food"]),
            action: buildAction("mushroom-farm"),
            status: () => projectStatus("mushroom-farm", "build")
        },
        {
            id: "storage",
            icon: "⌂",
            type: { key: "card.type.structureBasic" },
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
            type: { key: "card.type.structureBasic" },
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
        },
        {
            id: "construction",
            icon: "⚒",
            type: { key: "card.type.structureBasic" },
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
})();
