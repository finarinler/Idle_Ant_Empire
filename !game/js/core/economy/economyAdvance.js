/* =========================================================
    Zentrale Wirtschaft – Zeitfortschritt mit dynamischer Segmentierung
    Die vergangene Zeit wird in Abschnitte zerlegt, die jeweils beim nächsten
    relevanten Ereignis enden:
      Lager voll · Ressource leer · Todeszähler abgelaufen · Schlupf fertig ·
      Bauprojekt fertig · benötigte Schlupfressourcen erreicht.
    Ereignisse zum selben Zeitpunkt werden als gemeinsamer Block verarbeitet
    (erst alle Bestandsänderungen der Einheiten, dann alle Rückerstattungen).

    ONLINE und OFFLINE verwenden exakt diese Funktion.
========================================================= */

(function ()
{
    "use strict";

    const MAX_ITERATIONS = 2000000;

    /* ---------- Hilfen ---------- */

    function stepStock(stock, net, cap, dt, firedFull, firedEmpty)
    {
        if (net.isZero() || dt <= 0)
        {
            return stock;
        }

        if (net.isPositive())
        {
            if (stock.gte(cap)) { return stock; }            // Überschuss verfällt, nichts wird eingelagert
            if (firedFull)      { return cap; }
            return BigNum.min(cap, stock.add(net.mul(dt)));
        }

        if (firedEmpty) { return BigNum.ZERO; }

        const next = stock.add(net.mul(dt));
        return next.isNegative() ? BigNum.ZERO : next;      // niemals negativ
    }

    function getHatchDefinition()
    {
        return UnitRegistry.has("brood-expert") ? UnitRegistry.get("brood-expert").hatch : null;
    }

    // Startet einen Schlupf, wenn Experten, Ressourcen und Wohnraum vorhanden sind.
    // Die einmaligen Kosten werden beim Start vollständig abgezogen.
    function tryStartHatch()
    {
        const hatch = getHatchDefinition();
        const state = GameState.economy.hatch;

        if (!hatch || state.active) { return false; }

        const experts = Economy.getUnitNumber("brood-expert");

        if (experts <= 0) { return false; }
        if (Economy.getHousingFree().lt(1)) { return false; }
        if (!Economy.canAfford(hatch.cost)) { return false; }

        Economy._spend(hatch.cost);

        const seconds = hatch.getSeconds(experts);
        GameState.economy.hatch = { active: true, remaining: seconds, duration: seconds };

        return true;
    }

    // Zeit bis alle fehlenden Schlupfressourcen erreicht sind (null = nicht erreichbar / nicht relevant)
    function timeUntilHatchReady(flows)
    {
        const hatch = getHatchDefinition();
        const state = GameState.economy.hatch;

        if (!hatch || state.active) { return null; }
        if (Economy.getUnitNumber("brood-expert") <= 0) { return null; }
        if (Economy.getHousingFree().lt(1)) { return null; }

        let latest = 0;
        let missingAny = false;

        for (const resource of Object.keys(hatch.cost))
        {
            const needed = Big(hatch.cost[resource]);

            if (!RESOURCE_DEFINITIONS[resource] || flows.stock[resource].gte(needed)) { continue; }

            if (!flows.net[resource].isPositive() || flows.capacity[resource].lt(needed)) { return null; }

            missingAny = true;
            latest = Math.max(latest, needed.sub(flows.stock[resource]).div(flows.net[resource]).toNumber());
        }

        return missingAny ? latest : null;
    }

    /* ---------- Hauptfunktion ---------- */

    Economy.advance = function (seconds)
    {
        const result = { elapsed: 0, completed: [], deaths: [] };

        if (!Number.isFinite(seconds) || seconds <= 0 || Economy._advancing)
        {
            return result;
        }

        Economy._advancing = true;

        try
        {
            let remaining = seconds;
            let iterations = 0;
            const eco = GameState.economy;

            while (remaining > Economy.EPS)
            {
                if (++iterations > MAX_ITERATIONS)
                {
                    console.warn("[Economy] Iterationslimit erreicht, Rest der Zeit wird verworfen.");
                    break;
                }

                tryStartHatch();

                const flows = Economy.computeFlows();
                const candidates = [];

                // Lager voll / Ressource leer
                RESOURCE_IDS.forEach(id =>
                {
                    const stock = flows.stock[id];
                    const net = flows.net[id];

                    if (net.isPositive() && stock.lt(flows.capacity[id]))
                    {
                        candidates.push({ t: flows.capacity[id].sub(stock).div(net).toNumber(), kind: "full", id });
                    }
                    else if (net.isNegative() && stock.isPositive())
                    {
                        candidates.push({ t: stock.div(net.neg()).toNumber(), kind: "empty", id });
                    }
                });

                // Todeszähler
                const deathUnits = UnitRegistry.all().filter(unit => flows.deathCondition[unit.id]);

                deathUnits.forEach(unit =>
                {
                    const elapsed = eco.deathTimers[unit.id] || 0;
                    candidates.push({ t: Math.max(0, CORE_CONFIG.DEATH_TIMER_SECONDS - elapsed), kind: "death", id: unit.id });
                });

                // Schlupf
                if (eco.hatch.active)
                {
                    candidates.push({ t: eco.hatch.remaining, kind: "hatch", id: "hatch" });
                }
                else
                {
                    const ready = timeUntilHatchReady(flows);

                    if (ready !== null) { candidates.push({ t: ready, kind: "hatchReady", id: "hatch" }); }
                }

                // Laufende Einheitenausbildungen
                Object.entries(eco.trainings || {}).forEach(([unitId, training]) =>
                {
                    if (training && Number.isFinite(training.remaining))
                    {
                        candidates.push({ t: training.remaining, kind: "training", id: unitId });
                    }
                });

                // Bauprojekte
                ["free", "builder"].forEach(slot =>
                {
                    const project = GameState.construction[slot];

                    if (project) { candidates.push({ t: project.remaining, kind: "build", id: slot }); }
                });

                let dt = remaining;
                candidates.forEach(candidate => { dt = Math.min(dt, candidate.t); });
                dt = Math.max(0, dt);

                const fired = candidates.filter(candidate => candidate.t <= dt + Economy.EPS);
                const hasFired = (kind, id) => fired.some(candidate => candidate.kind === kind && candidate.id === id);

                /* ----- Zeit anwenden ----- */

                RESOURCE_IDS.forEach(id =>
                {
                    const stock = flows.stock[id];
                    const net = flows.net[id];

                    // Nicht erfüllter Verbrauch (Bestand 0, Nettoverbrauch)
                    if (stock.isZero() && net.isNegative())
                    {
                        if (!eco.unmet[id]) { eco.unmet[id] = BigNum.ZERO; }
                        eco.unmet[id] = eco.unmet[id].add(net.neg().mul(dt));
                    }

                    GameState.resources[id] = stepStock(
                        stock, net, flows.capacity[id], dt, hasFired("full", id), hasFired("empty", id)
                    );
                });

                // Beim Ereignis "Schlupfressourcen erreicht" exakt auf den Bedarf setzen (kein Hängenbleiben durch Rundung)
                if (fired.some(candidate => candidate.kind === "hatchReady"))
                {
                    const hatch = getHatchDefinition();

                    Object.keys(hatch.cost).forEach(resource =>
                    {
                        if (RESOURCE_DEFINITIONS[resource] && GameState.resources[resource].lt(hatch.cost[resource]))
                        {
                            GameState.resources[resource] = Big(hatch.cost[resource]);
                        }
                    });
                }

                // Todeszähler: nur ununterbrochene Erfüllung zählt, sonst vollständiger Reset
                UnitRegistry.all().forEach(unit =>
                {
                    if (flows.deathCondition[unit.id])
                    {
                        eco.deathTimers[unit.id] = (eco.deathTimers[unit.id] || 0) + dt;
                    }
                    else
                    {
                        delete eco.deathTimers[unit.id];
                    }
                });

                if (eco.hatch.active) { eco.hatch.remaining -= dt; }

                Object.values(eco.trainings || {}).forEach(training =>
                {
                    if (training) { training.remaining -= dt; }
                });

                ["free", "builder"].forEach(slot =>
                {
                    const project = GameState.construction[slot];
                    if (project) { project.remaining -= dt; }
                });

                remaining -= dt;
                result.elapsed += dt;

                /* ----- Ereignisblock ----- */

                const refunds = { food: BigNum.ZERO };

                // 1. Todesfälle: jeder betroffene Typ verliert höchstens eine Einheit
                fired.filter(candidate => candidate.kind === "death").forEach(candidate =>
                {
                    delete eco.deathTimers[candidate.id];

                    if (Economy._removeUnits(candidate.id, 1))
                    {
                        const refund = (UnitRegistry.get(candidate.id).refund || {}).food || 0;
                        refunds.food = refunds.food.add(refund);
                        result.deaths.push({ unit: candidate.id });
                    }
                });

                // 2. Schlupf abgeschlossen
                if (fired.some(candidate => candidate.kind === "hatch"))
                {
                    eco.hatch = { active: false, remaining: 0, duration: 0 };
                    GameState.resources.bredAnts = GameState.resources.bredAnts.add(1);
                    result.completed.push({ type: "hatch", durationSeconds: 0 });
                }

                // 3. Ausbildungen abgeschlossen
                fired.filter(candidate => candidate.kind === "training").forEach(candidate =>
                {
                    const training = eco.trainings[candidate.id];
                    if (!training) { return; }

                    delete eco.trainings[candidate.id];
                    Economy._addUnits(candidate.id, 1);

                    if (candidate.id === "scout")
                    {
                        GameState.expedition.scoutRestUntil = 0;
                        GameState.expedition.scoutEnabled = true;
                    }

                    result.completed.push({ type: "training", unit: candidate.id, durationSeconds: training.duration });
                });

                // 4. Bauprojekte abgeschlossen
                fired.filter(candidate => candidate.kind === "build").forEach(candidate =>
                {
                    const project = GameState.construction[candidate.id];

                    if (project)
                    {
                        GameState.construction[candidate.id] = null;
                        Economy._applyProject(project);
                        result.completed.push({
                            type: "build",
                            structure: project.structureId,
                            kind: project.kind,
                            durationSeconds: project.duration
                        });
                    }
                });

                // 4. Rückerstattungen gemeinsam, unter Beachtung der (neuen) Lagergrenze
                if (refunds.food.isPositive())
                {
                    Economy._store("food", refunds.food);
                }
            }
        }
        finally
        {
            Economy._advancing = false;
        }

        return result;
    };

    // Online-Fortschritt: verstrichene Echtzeit seit dem letzten Aufruf (gegen Doppelverbuchung gesichert)
    Economy.update = function (nowMs)
    {
        const now = nowMs === undefined ? Date.now() : nowMs;
        const eco = GameState.economy;

        if (!(eco.lastUpdateMs > 0))
        {
            eco.lastUpdateMs = now;
            return { elapsed: 0, completed: [], deaths: [] };
        }

        let deltaMs = now - eco.lastUpdateMs;

        if (deltaMs <= 0)
        {
            // Rückwärts springende Systemuhr: neu synchronisieren, keine Ressourcen erzeugen
            if (deltaMs < 0) { eco.lastUpdateMs = now; }
            return { elapsed: 0, completed: [], deaths: [] };
        }

        eco.lastUpdateMs = now;
        deltaMs = Math.min(deltaMs, CORE_CONFIG.MAX_OFFLINE_TIME_MS);

        return Economy.advance(deltaMs / 1000);
    };
})();
