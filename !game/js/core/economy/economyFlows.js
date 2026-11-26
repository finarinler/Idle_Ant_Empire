/* =========================================================
    Zentrale Wirtschaft – Flüsse, Versorgung und Effizienz
    Berechnet für den AKTUELLEN Zustand (Beginn eines Zeitintervalls):
      - Versorgungsverhältnis je Überlebensressource
      - Effizienz je Einheitentyp (schlechteste Überlebensressource)
      - Produktion, Verbrauch, Netto je Ressource
      - Kapazitäten
      - Todesbedingung je Einheitentyp

    Es gibt innerhalb eines Intervalls KEINE iterative Neuberechnung; die
    Effizienz wird beim nächsten Wirtschaftsereignis neu bestimmt.
========================================================= */

(function ()
{
    "use strict";

    const ZERO = BigNum.ZERO;

    function zeros()
    {
        const result = {};
        RESOURCE_IDS.forEach(id => { result[id] = ZERO; });
        return result;
    }

    // Ausgabe der Gebäudeproduktion für eine gegebene Effizienzverteilung.
    // Gebäude behalten volle Basis-Effizienz; Einheitenboni skalieren mit deren Effizienz.
    function structureOutput(structure, count, effOf, counts)
    {
        const out = zeros();

        if (!structure.production || count <= 0)
        {
            return out;
        }

        let bonus = 0;

        UnitRegistry.all().forEach(unit =>
        {
            (unit.abilities || []).forEach(ability =>
            {
                if (ability.type === "structureBonus" && ability.structure === structure.id)
                {
                    bonus += counts[unit.id].toNumber() * ability.perUnit * effOf(unit.id);
                }
            });
        });

        structure.production.forEach(entry =>
        {
            const total = Big(count).mul(entry.rate).mul(1 + bonus + Economy.modifiers.getProductionBonus(structure.id, entry.resource));
            out[entry.resource] = out[entry.resource].add(total);
        });

        return out;
    }

    Economy.computeFlows = function ()
    {
        const units = UnitRegistry.all();
        const structures = StructureRegistry.all();
        const stock = {};

        RESOURCE_IDS.forEach(id => { stock[id] = GameState.resources[id]; });

        const counts = {};
        units.forEach(unit => { counts[unit.id] = Economy.getUnitCount(unit.id); });

        // Aktive Profile
        const consumption = [];
        const production = [];

        units.forEach(unit =>
        {
            const n = counts[unit.id];

            if (n.isZero()) { return; }

            (unit.consumption || []).forEach(entry =>
            {
                if (entry.enabled && !entry.enabled()) { return; }
                consumption.push({ unit, resource: entry.resource, rate: entry.rate, kind: entry.kind || "survival", n });
            });

            (unit.production || []).forEach(entry =>
            {
                if (entry.enabled && !entry.enabled()) { return; }
                production.push({ unit, resource: entry.resource, rate: entry.rate, work: entry.requires || [], n });
            });
        });

        // 1. Nominale Produktion (alle Einheiten bei 100 %) und Bedarf
        const nominal = zeros();
        const survivalDemand = zeros();
        const workDemand = zeros();
        const full = () => 1;

        production.forEach(entry =>
        {
            nominal[entry.resource] = nominal[entry.resource].add(entry.n.mul(entry.rate));
            entry.work.forEach(req => { workDemand[req.resource] = workDemand[req.resource].add(entry.n.mul(req.rate)); });
        });

        structures.forEach(structure =>
        {
            const out = structureOutput(structure, Economy.getStructureNumber(structure.id), full, counts);
            RESOURCE_IDS.forEach(id => { nominal[id] = nominal[id].add(out[id]); });
        });

        consumption.forEach(entry =>
        {
            if (entry.kind === "survival")
            {
                survivalDemand[entry.resource] = survivalDemand[entry.resource].add(entry.n.mul(entry.rate));
            }
        });

        // 2. Versorgungsverhältnis je Überlebensressource
        //    Bestand > 0: der Bestand deckt den Bedarf bis zum Ereignis "Bestand leer" (Verhältnis 1).
        //    Bestand = 0: verfügbare Produktion / Bedarf.
        const ratio = {};

        RESOURCE_IDS.forEach(id =>
        {
            if (survivalDemand[id].isZero() || stock[id].isPositive())
            {
                ratio[id] = 1;
                return;
            }

            const value = nominal[id].div(survivalDemand[id]);
            ratio[id] = value.gte(1) ? 1 : Math.max(0, value.toNumber());
        });

        // 3. Effizienz je Einheitentyp: schlechteste Versorgung seiner Überlebensressourcen
        const efficiency = {};

        units.forEach(unit =>
        {
            let worst = 1;

            (unit.consumption || []).forEach(entry =>
            {
                if (entry.enabled && !entry.enabled()) { return; }
                if ((entry.kind || "survival") === "survival") { worst = Math.min(worst, ratio[entry.resource]); }
            });

            efficiency[unit.id] = worst;
        });

        const effOf = id => efficiency[id];

        // 4. Arbeitsressourcen: blockieren nur die davon abhängige Produktion
        const workBlocked = {};

        RESOURCE_IDS.forEach(id =>
        {
            workBlocked[id] = workDemand[id].isPositive() && stock[id].isZero() && nominal[id].lt(workDemand[id]);
        });

        const isBlocked = entry => entry.work.some(req => workBlocked[req.resource]);

        // 5. Tatsächliche Produktion und Verbrauch
        const produced = zeros();
        const consumed = zeros();

        production.forEach(entry =>
        {
            if (isBlocked(entry)) { return; }

            const factor = effOf(entry.unit.id) * Economy.modifiers.getEfficiencyFactor(entry.unit.id)
                * (1 + Economy.modifiers.getProductionBonus(entry.unit.id, entry.resource));

            produced[entry.resource] = produced[entry.resource].add(entry.n.mul(entry.rate).mul(factor));
            entry.work.forEach(req => { consumed[req.resource] = consumed[req.resource].add(entry.n.mul(req.rate)); });
        });

        structures.forEach(structure =>
        {
            const out = structureOutput(structure, Economy.getStructureNumber(structure.id), effOf, counts);
            RESOURCE_IDS.forEach(id => { produced[id] = produced[id].add(out[id]); });
        });

        consumption.forEach(entry =>
        {
            if (entry.kind !== "survival") { return; }

            // Sinkt die Effizienz, steigt der Überlebensverbrauch im gleichen Umfang: 50 % → +50 %
            const surcharge = 2 - effOf(entry.unit.id);
            consumed[entry.resource] = consumed[entry.resource].add(entry.n.mul(entry.rate).mul(surcharge));
        });

        const net = {};
        const capacity = {};

        RESOURCE_IDS.forEach(id =>
        {
            net[id] = produced[id].sub(consumed[id]);
            capacity[id] = Economy.computeCapacity(id, effOf);
        });

        // 6. Todesbedingung: leere Überlebensressource UND unvollständige Versorgung.
        // Auch bei geringer Restproduktion kann die Kolonie unterversorgt sein;
        // exakt 0 % Effizienz wäre als Auslöser zu streng und könnte Hungertod verhindern.
        const deathCondition = {};

        units.forEach(unit =>
        {
            deathCondition[unit.id] = false;

            if (counts[unit.id].isZero()) { return; }

            (unit.consumption || []).forEach(entry =>
            {
                if (entry.enabled && !entry.enabled()) { return; }

                if ((entry.kind || "survival") === "survival"
                    && stock[entry.resource].isZero()
                    && ratio[entry.resource] < 1)
                {
                    deathCondition[unit.id] = true;
                }
            });
        });

        return {
            counts, stock, ratio, efficiency, produced, consumed, net, capacity,
            nominal, survivalDemand, workBlocked, deathCondition,
            consumptionEntries: consumption
        };
    };

    // Mangelbericht: je Einheitentyp und Ressource benötigt / verfügbar / fehlend (pro Sekunde)
    Economy.getShortageReport = function ()
    {
        const flows = Economy.computeFlows();
        const rows = [];

        flows.consumptionEntries.forEach(entry =>
        {
            if (entry.kind !== "survival") { return; }

            const needed = entry.n.mul(entry.rate);
            const available = needed.mul(flows.ratio[entry.resource]);

            rows.push({
                unit: entry.unit.id,
                resource: entry.resource,
                needed,
                available,
                missing: needed.sub(available)
            });
        });

        return rows;
    };

    Economy.getNetRate = function (resource)
    {
        return Economy.computeFlows().net[resource];
    };
})();
