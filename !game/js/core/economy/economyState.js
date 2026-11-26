/* =========================================================
    Zentrale Wirtschaft – Zustandszugriff
    Lesender Zugriff auf Bestände, Wohnraum und Kapazitäten.
    Die Wirtschaft (Economy) ist die EINZIGE Stelle, die Ressourcenbestände
    verändert. Die UI und alle Definitionsdateien lesen nur.

    Diese Datei enthält KEINEN DOM-Zugriff (sie ist in Node testbar).
========================================================= */

const Economy = {
    EPS: 1e-9,

    // Haken für spätere Forschungsboni. Heute neutral.
    //  - Effizienzfaktor wirkt multiplikativ zur Effizienz (50 % × 1,20 = 60 %)
    //  - Produktionsboni gleicher Art werden ADDIERT (+20 % und +10 % = +30 %)
    modifiers: {
        getEfficiencyFactor(unitId) { return 1; },
        getProductionBonus(targetId, resource) {
            const achievements = GameState.achievements || {};

            if (resource === "larvae") {
                if (achievements.queenColonyHundred) { return 0.25; }
                if (achievements.queenColonyTwentyFive) { return 0.10; }
                if (achievements.smallColony) { return 0.05; }
                return 0;
            }

            if (targetId !== "mushroom-farm" || resource !== "food") { return 0; }
            if (achievements.collectorTwoFifty) { return 0.10; }
            if (achievements.collectorHundred) { return 0.075; }
            if (achievements.collectorFifty) { return 0.05; }
            if (achievements.collectorTwentyFive) { return 0.025; }
            if (achievements.collectorTen) { return 0.01; }
            if (achievements.mushroomFarmTwoFifty) { return 0.25; }
            if (achievements.mushroomFarmHundred) { return 0.20; }
            if (achievements.mushroomFarmFifty) { return 0.15; }
            if (achievements.mushroomFarmTwentyFive) { return 0.10; }
            if (achievements.mushroomFarmTen) { return 0.01; }
            return 0;
        },
        getCapacityBonus(resource) { return { absolute: 0, percent: 0 }; }
    }
};

(function ()
{
    "use strict";

    /* ---------- Einheiten ---------- */

    function readStore(store)
    {
        switch (store.kind)
        {
            case "ants":     return getTotalAnts();
            case "resource": return GameState.resources[store.key];
            default:         return Big(GameState[store.section][store.key] || 0);
        }
    }

    Economy.getUnitCount = function (id)
    {
        return readStore(UnitRegistry.get(id).store);
    };

    Economy.getUnitNumber = function (id)
    {
        return Economy.getUnitCount(id).toNumber();
    };

    // Intern: Einheiten hinzufügen. pool nur für Ameisen: "ants" | "antsFound" | "bredAnts"
    Economy._addUnits = function (id, amount, pool)
    {
        const store = UnitRegistry.get(id).store;
        const add = Big(amount);

        if (store.kind === "ants")
        {
            const key = pool || store.boughtKey || "ants";
            GameState.resources[key] = GameState.resources[key].add(add);
        }
        else if (store.kind === "resource")
        {
            GameState.resources[store.key] = GameState.resources[store.key].add(add);
        }
        else
        {
            GameState[store.section][store.key] = (GameState[store.section][store.key] || 0) + add.toNumber();
        }
    };

    // Intern: Ameisen abziehen. Reihenfolge verbindlich: gekaufte, gefundene, gezüchtete.
    Economy._removeAnts = function (amount)
    {
        const needed = Big(amount);

        if (needed.isNegative() || getTotalAnts().lt(needed))
        {
            return false;
        }

        const resources = GameState.resources;
        let remaining = needed;

        const fromBought = BigNum.min(resources.ants, remaining);
        resources.ants = resources.ants.sub(fromBought);
        remaining = remaining.sub(fromBought);

        const fromFound = BigNum.min(resources.antsFound, remaining);
        resources.antsFound = resources.antsFound.sub(fromFound);
        remaining = remaining.sub(fromFound);

        resources.bredAnts = resources.bredAnts.sub(remaining);

        return true;
    };

    Economy._removeUnits = function (id, amount)
    {
        const store = UnitRegistry.get(id).store;
        const remove = Big(amount);

        if (store.kind === "ants")
        {
            return Economy._removeAnts(remove);
        }

        if (store.kind === "resource")
        {
            if (GameState.resources[store.key].lt(remove)) { return false; }
            GameState.resources[store.key] = GameState.resources[store.key].sub(remove);
            return true;
        }

        const current = GameState[store.section][store.key] || 0;

        if (current < remove.toNumber()) { return false; }
        GameState[store.section][store.key] = current - remove.toNumber();
        return true;
    };

    /* ---------- Gebäude ---------- */

    Economy.getStructureNumber = function (id)
    {
        const store = StructureRegistry.get(id).store;
        return Number(GameState[store.section][store.key]) || 0;
    };

    /* ---------- Wohnraum ---------- */

    Economy.getHousingPerChamber = function ()
    {
        return StructureRegistry.get("housing-chamber").housingCapacity(GameState.structures.housingLevel);
    };

    Economy.getHousingCapacity = function ()
    {
        return Big(GameState.structures.housingCount).mul(Economy.getHousingPerChamber());
    };

    // Belegter Wohnraum inklusive des für einen laufenden Schlupf reservierten Platzes
    Economy.getHousingUsed = function ()
    {
        let used = BigNum.ZERO;

        UnitRegistry.all().forEach(def =>
        {
            if (def.housing > 0)
            {
                used = used.add(Economy.getUnitCount(def.id).mul(def.housing));
            }
        });

        if (GameState.economy.hatch.active)
        {
            used = used.add(1);
        }

        Object.keys(GameState.economy.trainings || {}).forEach(id =>
        {
            if (!UnitRegistry.has(id)) { return; }
            const housing = UnitRegistry.get(id).housing || 0;
            if (housing > 0) { used = used.add(housing); }
        });

        return used;
    };

    Economy.getHousingFree = function ()
    {
        return Economy.getHousingCapacity().sub(Economy.getHousingUsed());
    };

    /* ---------- Kapazität ----------
       Reihenfolge (zentral an EINER Stelle):
         Basis = Grundkapazität der Ressource, ersetzt durch den Gesamtwert eines gebauten
                 Lagergebäudes (z. B. Vorratskammer = 10.000 INSGESAMT, nicht zusätzlich)
         + absolute Boni (addiert)
         × Verdopplungen durch Einheiten, je Einheit (1 + Effizienz)^Anzahl
         × (1 + Summe der prozentualen Boni)
    */
    Economy.computeCapacity = function (resource, effOf)
    {
        let base = Big(RESOURCE_DEFINITIONS[resource].baseCapacity);
        let absolute = BigNum.ZERO;
        let percent = 0;
        let multiplier = BigNum.ONE;

        StructureRegistry.all().forEach(def =>
        {
            const effect = def.capacity;

            if (!effect || effect.resource !== resource || Economy.getStructureNumber(def.id) <= 0)
            {
                return;
            }

            if (effect.total !== undefined)
            {
                base = BigNum.max(base, effect.total);
            }

            if (effect.absolute)
            {
                absolute = absolute.add(effect.absolute);
            }
        });

        UnitRegistry.all().forEach(def =>
        {
            (def.capacityEffects || []).forEach(effect =>
            {
                if (effect.resource !== resource) { return; }

                const count = Economy.getUnitCount(def.id);

                if (count.isZero()) { return; }

                const efficiency = effOf ? effOf(def.id) : 1;

                if (effect.type === "doubling")
                {
                    multiplier = multiplier.mul(Big(1 + efficiency).pow(count));
                }
                else if (effect.type === "absolute")
                {
                    absolute = absolute.add(count.mul(effect.amount).mul(efficiency));
                }
                else if (effect.type === "percent")
                {
                    percent += count.toNumber() * effect.amount * efficiency;
                }
            });
        });

        const modifier = Economy.modifiers.getCapacityBonus(resource);
        absolute = absolute.add(modifier.absolute || 0);
        percent += modifier.percent || 0;

        return base.add(absolute).mul(multiplier).mul(1 + percent);
    };
})();
