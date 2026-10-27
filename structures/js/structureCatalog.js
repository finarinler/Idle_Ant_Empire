/* =========================================================
    Gebäude-Katalog
    Zentrale Definition aller Gebäude-Karten (Daten und Aktionen).
    Die Darstellung übernimmt der gemeinsame CardBuilder.
    Baulogik: structures.js
========================================================= */

(() =>
{
    "use strict";

    function buildStatus(countKey, cost)
    {
        return () =>
        {
            if (GameState.structures[countKey] > 0)
            {
                return { state: "built" };
            }

            if (!GameState.achievements.smallColony)
            {
                return { state: "locked" };
            }

            return { state: canAffordCost(cost) ? "available" : "missing" };
        };
    }

    CardBuilder.register("structures-basic", [
        {
            id: "storage",
            icon: "⌂",
            type: { key: "card.type.structureBasic" },
            name: { key: "structure.storage.name" },
            desc: { key: "structure.storage.desc" },
            count: { value: () => GameState.structures.storageCount, max: 1 },
            stats: [
                { label: { key: "card.stat.foodLimit" }, value: () => formatGameNumber(CORE_CONFIG.FOOD_STORAGE_CAPACITY), tone: "positive" }
            ],
            cost: () => ({ values: FOOD_STORAGE_COST, order: STRUCTURE_COST_ORDER }),
            action: { label: { key: "button.build" }, missingLabel: { key: "button.build" }, run: buyStorage },
            status: buildStatus("storageCount", FOOD_STORAGE_COST)
        },
        {
            id: "nursery",
            icon: "⌂",
            type: { key: "card.type.structureBasic" },
            name: { key: "structure.nursery.name" },
            desc: { key: "structure.nursery.desc" },
            count: { value: () => GameState.structures.nurseryCount, max: 1 },
            stats: [
                { label: { key: "card.stat.larvaeLimit" }, value: () => formatGameNumber(CORE_CONFIG.LARVAE_NURSERY_CAPACITY), tone: "positive" }
            ],
            cost: () => ({ values: LARVAE_STORAGE_COST, order: STRUCTURE_COST_ORDER }),
            action: { label: { key: "button.build" }, missingLabel: { key: "button.build" }, run: buyNursery },
            status: buildStatus("nurseryCount", LARVAE_STORAGE_COST)
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
