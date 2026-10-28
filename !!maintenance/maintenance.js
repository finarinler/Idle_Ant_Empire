/* Idle Ant Empire – gemeinsamer Wartungsstatus + Countdown-Log

   Ablauf (statisch, ohne Server): mode.js wird jede Sekunde mit no-store neu geladen und als
   Text ausgewertet (kein eval). Jede Seite (Startseite, Spiel, Wartungsseite) entscheidet
   daraus selbst. Der lokale Takt (TICK_MS) zählt den Countdown herunter, ohne dass dafür
   jede Sekunde ein erfolgreicher Netzabruf nötig ist.

   Zustände:
   OFF          Normalbetrieb, keine Warnungen, keine Weiterleitungen.
   COUNTDOWN    Endzeitpunkt in der Zukunft: laufende Spiele (Tab-Marker) bleiben spielbar und
                loggen Warnungen; neue Besucher gehen direkt zur Wartungsseite. Ab dem
                Endzeitpunkt gehen ALLE zur Wartungsseite.
   MAINTENANCE  Wartungsseite für alle ("ON" ist ein Alias).
   INVALID      (nur intern) Konfiguration unlesbar/ungültig: keine Weiterleitung, Fehler in der
                Konsole, letzter gültiger Zustand bleibt erhalten. */
(() => {
    "use strict";
    const isHttp = location.protocol === "http:" || location.protocol === "https:";
    if (!isHttp) return; // file:// bleibt für lokale Tests unverändert
    // Mehrfaches Einbinden/Ausführen darf keine zweiten Timer, Warnungen oder Redirects erzeugen.
    if (window.__IDLE_ANT_MAINTENANCE_STARTED__) return;
    window.__IDLE_ANT_MAINTENANCE_STARTED__ = true;
    // Muss mit ?v=... in den <script>-Tags (index.html, game.html, maintenance.html) übereinstimmen,
    // damit Browser/GitHub-Pages-Cache (ca. 10 Min.) nach einem Update kein altes Skript ausliefern.
    const SCRIPT_VERSION = "20261028b";
    window.IDLE_ANT_MAINTENANCE_VERSION = SCRIPT_VERSION;

    const POLL_MS = 1000, TICK_MS = 250, FETCH_TIMEOUT_MS = 8000;
    const MILESTONES = [300,240,180,120,60,30,10,9,8,7,6,5,4,3,2,1,0]; // absteigend
    const MINUTE_KEYS = {300:"maintenance.countdown5",240:"maintenance.countdown4",180:"maintenance.countdown3",120:"maintenance.countdown2",60:"maintenance.countdown1",30:"maintenance.countdown30",10:"maintenance.countdown10",0:"maintenance.countdownNow",1:"maintenance.countdownOneSecond"};
    const activeGameSessionKey = "idleAntEmpireActiveGameSession";
    const ISO_WITH_ZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

    const path = location.pathname.toLowerCase();
    const isMaintenancePage = path.endsWith("/!!maintenance/maintenance.html");
    const isGamePage = path.endsWith("/!game/game.html");
    const isLandingPage = path.endsWith("/index.html") || path.endsWith("/");

    function resolveMaintenanceDir() {
        try {
            const cs = document.currentScript;
            if (cs && cs.src) return new URL("./", new URL(cs.src));
        } catch (_) {}
        const root = location.pathname.replace(/\/(!game\/game\.html|!!maintenance\/maintenance\.html|index\.html)$/i, "/").replace(/([^/])$/, "$1/");
        return new URL(root + "!!maintenance/", location.origin);
    }
    const pageName = isMaintenancePage ? "maintenance" : isGamePage ? "game" : "landing";
    const lastRedirectKey = "idleAntEmpireLastMaintenanceRedirect";
    const maintenanceDir = resolveMaintenanceDir();
    const maintenanceUrl = () => new URL("maintenance.html", maintenanceDir).href;
    const indexUrl = () => new URL("../index.html", maintenanceDir).href;

    /* ---------- Tab-Marker: lief dieses Spiel schon vor dem Countdown? ---------- */
    function hasExistingGameSession() {
        try { return sessionStorage.getItem(activeGameSessionKey) === "1"; }
        catch (_) { return false; }
    }
    function markGameSessionActive(active) {
        try {
            if (active) sessionStorage.setItem(activeGameSessionKey, "1");
            else sessionStorage.removeItem(activeGameSessionKey);
        } catch (_) {}
    }
    // Startseite/Wartungsseite = neuer Besuch. Das Spiel (iframe der Startseite) setzt den Marker erneut.
    if (isLandingPage || isMaintenancePage) markGameSessionActive(false);

    if (!isMaintenancePage) {
        const style = document.createElement("style");
        style.textContent = "html.maintenance-checking body{visibility:hidden!important}";
        document.head.appendChild(style);
        document.documentElement.classList.add("maintenance-checking");
    }

    /* ---------- Konfiguration auslesen (rein, ohne Seiteneffekte) ---------- */
    function stripComments(src) {
        return String(src).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'\\])\/\/.*$/gm, "$1");
    }
    function lastCapture(src, regex) {
        let last = null, m;
        regex.lastIndex = 0;
        while ((m = regex.exec(src)) !== null) last = m;
        return last;
    }
    function parseConfig(text) {
        const src = stripComments(text);
        const warnings = [];
        const stateM = lastCapture(src, /IDLE_ANT_MAINTENANCE_STATE\s*=\s*(?:"([^"]*)"|'([^']*)')/g);
        const endM = lastCapture(src, /IDLE_ANT_MAINTENANCE_END_AT\s*=\s*(?:"([^"]*)"|'([^']*)')/g);
        const legacyM = lastCapture(src, /IDLE_ANT_MAINTENANCE_MODE\s*=\s*(true|false)\b/g);
        const legacy = legacyM ? legacyM[1] === "true" : null;
        let state;
        if (stateM) {
            const raw = String(stateM[1] !== undefined ? stateM[1] : stateM[2]).trim().toUpperCase();
            state = raw === "ON" ? "MAINTENANCE" : raw;
            if (!["OFF", "COUNTDOWN", "MAINTENANCE"].includes(state))
                return { state: "INVALID", error: `Unbekannter IDLE_ANT_MAINTENANCE_STATE: "${raw}"`, warnings };
            if (legacy === true && state !== "MAINTENANCE")
                warnings.push(`IDLE_ANT_MAINTENANCE_MODE=true widerspricht IDLE_ANT_MAINTENANCE_STATE="${state}". STATE gilt, das alte Boolean wird ignoriert.`);
        } else if (legacyM) {
            state = legacy ? "MAINTENANCE" : "OFF";
        } else {
            return { state: "INVALID", error: "Keine Wartungskonfiguration in mode.js gefunden.", warnings };
        }
        let endAt = null;
        if (state === "COUNTDOWN") {
            const rawEnd = endM ? String(endM[1] !== undefined ? endM[1] : endM[2]).trim() : "";
            if (!rawEnd) return { state: "INVALID", error: "COUNTDOWN ohne IDLE_ANT_MAINTENANCE_END_AT.", warnings };
            if (!ISO_WITH_ZONE.test(rawEnd)) return { state: "INVALID", error: `IDLE_ANT_MAINTENANCE_END_AT braucht ISO-Format mit Zeitzone (z. B. 2026-10-27T21:40:00Z): "${rawEnd}"`, warnings };
            endAt = Date.parse(rawEnd);
            if (!Number.isFinite(endAt)) return { state: "INVALID", error: `IDLE_ANT_MAINTENANCE_END_AT ist kein gültiges Datum: "${rawEnd}"`, warnings };
        }
        return { state, endAt, warnings };
    }

    /* ---------- Laufzeitzustand ---------- */
    let cfg = { state: "OFF", endAt: null, valid: false }; // valid=false bis zur ersten erfolgreichen Auswertung
    let invalidReason = null, conflictReason = null;
    let redirecting = false, checkInProgress = false, firstStatusReceived = false;
    let serverOffset = 0, offsetKnown = false;
    let pollTimer = null, tickTimer = null;
    let lastStateLabel = null;
    const reported = new Set();
    // Log-Zustand (nur im Spiel)
    let trackedEnd = null, baseline = false;
    const consumed = new Set();
    const pending = { started: false, mark: null };

    const nowMs = () => Date.now() + serverOffset;
    const remainingSeconds = () => cfg.state === "COUNTDOWN" ? Math.ceil((cfg.endAt - nowMs()) / 1000) : null;
    function reportOnce(level, message) {
        if (reported.has(message)) return;
        reported.add(message);
        try { console[level](`[Wartung] ${message}`); } catch (_) {}
    }
    function publishStatus() {
        const rem = remainingSeconds();
        window.IDLE_ANT_MAINTENANCE_STATUS = {
            state: !cfg.valid && invalidReason ? "INVALID" : cfg.state,
            endAt: cfg.endAt || 0,
            remainingSeconds: rem === null ? null : Math.max(0, rem),
            invalid: !!invalidReason, error: invalidReason, conflict: conflictReason
        };
    }

    /* ---------- Weiterleitung (genau ein Entscheider pro Tab) ---------- */
    function go(url, reason) {
        if (redirecting) return;
        redirecting = true;
        stopTimers();
        try { console.info(`[Wartung v${SCRIPT_VERSION}] Weiterleitung (${pageName}) -> ${url} | Grund: ${reason}`); } catch (_) {}
        try {
            sessionStorage.setItem(lastRedirectKey, JSON.stringify({ version: SCRIPT_VERSION, page: pageName, reason, state: cfg.state, endAt: cfg.endAt ? new Date(cfg.endAt).toISOString() : null, at: new Date(nowMs()).toISOString(), url }));
        } catch (_) {}
        let target = window;
        try { if (window.top && window.top !== window) { void window.top.location.href; target = window.top; } } catch (_) { target = window; }
        try {
            if (target.__IDLE_ANT_MAINTENANCE_NAVIGATING__) return; // anderes Fenster desselben Tabs war schneller
            target.__IDLE_ANT_MAINTENANCE_NAVIGATING__ = url;
        } catch (_) {}
        target.location.replace(url);
    }

    /* ---------- Log-Warnungen (nur Spielseite) ---------- */
    function logReady() {
        return typeof window.addMaintenanceLogEntry === "function" && typeof window.isLogReady === "function" && window.isLogReady();
    }
    function milestoneEntry(seconds) {
        if (MINUTE_KEYS[seconds]) return { key: MINUTE_KEYS[seconds], params: null };
        return { key: "maintenance.countdownSecond", params: { seconds: String(seconds) } };
    }
    function resetLogTracking() { trackedEnd = null; baseline = false; consumed.clear(); pending.started = false; pending.mark = null; }
    function observeCountdown() {
        if (!isGamePage) return;
        if (trackedEnd === null) { resetLogTracking(); pending.started = true; trackedEnd = cfg.endAt; }
        else if (trackedEnd !== cfg.endAt) { baseline = false; consumed.clear(); pending.mark = null; trackedEnd = cfg.endAt; } // Endzeit geändert
    }
    function collectMilestones(rem) {
        const first = !baseline;
        baseline = true;
        const reached = MILESTONES.filter(m => m >= rem && !consumed.has(m));
        if (!reached.length) return;
        reached.forEach(m => consumed.add(m));
        // Beim ersten Erkennen werden bereits verstrichene Marken nicht rückwirkend ausgegeben.
        if (first) { if (reached.includes(rem)) pending.mark = rem; return; }
        pending.mark = Math.min(...reached); // nach z. B. gedrosseltem Tab nur die aktuellste Marke
    }
    function deliverPending() {
        if (!isGamePage || (!pending.started && pending.mark === null) || !logReady()) return;
        const items = [];
        if (pending.started) items.push({ key: "maintenance.countdownStarted", params: null });
        if (pending.mark !== null) items.push(milestoneEntry(pending.mark));
        pending.started = false; pending.mark = null;
        items.forEach(item => { try { window.addMaintenanceLogEntry(item.key, item.params); } catch (e) { console.error("[Wartung] Log-Eintrag fehlgeschlagen", e); } });
    }

    /* ---------- Entscheidung ---------- */
    function enforce() {
        if (redirecting) return;
        const now = nowMs();
        const maintenance = cfg.state === "MAINTENANCE" || (cfg.state === "COUNTDOWN" && cfg.endAt <= now);
        const countdown = cfg.state === "COUNTDOWN" && cfg.endAt > now;
        if (isMaintenancePage) { if (cfg.valid && cfg.state === "OFF") go(indexUrl(), "Status OFF"); return; }
        if (!cfg.valid) return; // ungültig/unbekannt: nichts erzwingen
        if (maintenance) { go(maintenanceUrl(), cfg.state === "MAINTENANCE" ? "Status MAINTENANCE" : "Countdown abgelaufen (END_AT erreicht)"); return; }
        if (countdown && !hasExistingGameSession() && (!isGamePage || !firstStatusReceived)) go(maintenanceUrl(), "neuer Besucher waehrend Countdown (kein laufendes Spiel in diesem Tab)");
    }
    function tick() {
        if (redirecting) return;
        if (cfg.state !== "COUNTDOWN") { stopTick(); return; }
        const rem = remainingSeconds();
        if (isGamePage && firstStatusReceived) collectMilestones(Math.max(0, rem));
        deliverPending();
        publishStatus();
        enforce();
    }
    function startTick() { if (!tickTimer) tickTimer = window.setInterval(tick, TICK_MS); }
    function stopTick() { if (tickTimer) { window.clearInterval(tickTimer); tickTimer = null; } }
    function stopTimers() { stopTick(); if (pollTimer) { window.clearInterval(pollTimer); pollTimer = null; } }

    function applyParsed(parsed) {
        (parsed.warnings || []).forEach(w => reportOnce("warn", w));
        conflictReason = parsed.warnings && parsed.warnings.length ? parsed.warnings[0] : null;
        if (parsed.state === "INVALID") {
            invalidReason = parsed.error;
            reportOnce("error", `${parsed.error} Es wird nicht weitergeleitet.`);
            if (!cfg.valid) { cfg = { state: "OFF", endAt: null, valid: false }; }
            publishStatus();
            if (!firstStatusReceived) { // Spiel startet fail-open: zählt als laufende Instanz
                firstStatusReceived = true;
                if (isGamePage) markGameSessionActive(true);
            }
            return;
        }
        invalidReason = null;
        const stateLabel = parsed.state + (parsed.endAt ? ` (Ende ${new Date(parsed.endAt).toISOString()})` : "");
        if (stateLabel !== lastStateLabel) { lastStateLabel = stateLabel; try { console.info(`[Wartung v${SCRIPT_VERSION}] Status (${pageName}): ${stateLabel}`); } catch (_) {} }
        const wasCountdown = cfg.valid && cfg.state === "COUNTDOWN";
        cfg = { state: parsed.state, endAt: parsed.endAt, valid: true };
        if (!(cfg.state === "COUNTDOWN") && wasCountdown) resetLogTracking();
        publishStatus();
        enforce();
        if (redirecting) return;
        if (isGamePage && !firstStatusReceived) markGameSessionActive(true); // blieb im Spiel -> laufende Instanz
        firstStatusReceived = true;
        if (cfg.state === "COUNTDOWN") { observeCountdown(); startTick(); tick(); }
        else stopTick();
    }
    function updateOffset(response, startedAt) {
        try {
            const dateMs = Date.parse(response.headers.get("date"));
            if (!Number.isFinite(dateMs)) return;
            const age = Number(response.headers.get("age")) || 0;
            const received = Date.now();
            // Date hat nur Sekundenauflösung (abgeschnitten): +500 ms als Mittelwert; Genauigkeit ca. ±1–2 s.
            const offset = dateMs + 500 + age * 1000 - (startedAt + received) / 2;
            if (Math.abs(offset) > 7 * 24 * 3600 * 1000) return;
            if (!offsetKnown || Math.abs(offset - serverOffset) > 1500) { serverOffset = offset; offsetKnown = true; }
        } catch (_) {}
    }
    async function checkMaintenanceStatus() {
        if (redirecting || checkInProgress) return;
        checkInProgress = true;
        const ctrl = typeof AbortController === "function" ? new AbortController() : null;
        const abortTimer = ctrl ? window.setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS) : null;
        try {
            const startedAt = Date.now();
            const response = await fetch(new URL("mode.js?check=" + Date.now(), maintenanceDir).href, { cache: "no-store", headers: { "Cache-Control": "no-cache" }, signal: ctrl ? ctrl.signal : undefined });
            if (!response.ok) throw new Error("status unavailable (HTTP " + response.status + ")");
            updateOffset(response, startedAt);
            applyParsed(parseConfig(await response.text()));
        } catch (error) {
            // Netzproblem: letzten Zustand behalten, nie dauerhaft aussperren; nächster Check versucht es erneut.
            reportOnce("warn", "Wartungsstatus nicht abrufbar: " + (error && error.message ? error.message : error));
        } finally {
            if (abortTimer) window.clearTimeout(abortTimer);
            checkInProgress = false;
            if (!isMaintenancePage) document.documentElement.classList.remove("maintenance-checking");
        }
    }
    window.IDLE_ANT_MAINTENANCE_API = Object.freeze({ parseConfig });
    try {
        console.info(`[Wartung v${SCRIPT_VERSION}] gestartet (${pageName})`);
        if (isMaintenancePage) { const last = sessionStorage.getItem(lastRedirectKey); if (last) console.info("[Wartung] letzte Weiterleitung in diesem Tab:", last); }
    } catch (_) {}
    checkMaintenanceStatus();
    pollTimer = window.setInterval(checkMaintenanceStatus, POLL_MS);
})();
