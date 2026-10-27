/* Idle Ant Empire – gemeinsamer Wartungsstatus + Countdown-Log */
(() => {
    "use strict";
    const isHttp = location.protocol === "http:" || location.protocol === "https:";
    if (!isHttp) return; // file:// bleibt für lokale Tests unverändert
    const scriptUrl = document.currentScript && document.currentScript.src ? new URL(document.currentScript.src) : new URL("maintenance.js", location.href);
    const maintenanceDir = new URL("./", scriptUrl);
    const path = location.pathname.toLowerCase();
    const isMaintenancePage = path.endsWith("/!!maintenance/maintenance.html");
    const isGamePage = path.endsWith("/!game/game.html");
    const isLandingPage = path.endsWith("/index.html") || path.endsWith("/");
    if (!isMaintenancePage) {
        const style = document.createElement("style");
        style.textContent = "html.maintenance-checking body{visibility:hidden!important}";
        document.head.appendChild(style);
        document.documentElement.classList.add("maintenance-checking");
    }
    let redirecting = false, checkInProgress = false, firstStatusReceived = false;
    let currentState = "OFF", endAt = 0;
    let lastLoggedMark = null;
    const milestones = [300,240,180,120,60,30,10,9,8,7,6,5,4,3,2,1,0];
    const keyFor = seconds => seconds === 300 ? "maintenance.countdown5" : seconds === 240 ? "maintenance.countdown4" : seconds === 180 ? "maintenance.countdown3" : seconds === 120 ? "maintenance.countdown2" : seconds === 60 ? "maintenance.countdown1" : seconds === 30 ? "maintenance.countdown30" : seconds === 10 ? "maintenance.countdown10" : seconds === 0 ? "maintenance.countdownNow" : "maintenance.countdownSecond";
    function getLanguage() {
        try { return window.I18N && I18N.getLanguageInfo ? I18N.getLanguageInfo().htmlLang : document.documentElement.lang || "de"; }
        catch (_) { return document.documentElement.lang || "de"; }
    }
    function localizedCountdown(seconds) {
        const lang = getLanguage().slice(0,2);
        const text = {
            de: {300:"WARTUNG IN 5 MINUTEN!",240:"WARTUNG IN 4 MINUTEN!",180:"WARTUNG IN 3 MINUTEN!",120:"WARTUNG IN 2 MINUTEN!",60:"WARTUNG IN 1 MINUTE!",30:"WARTUNG IN 30 SEKUNDEN!",10:"WARTUNG IN 10 SEKUNDEN!",now:"WARTUNG!",s:n=>`WARTUNG IN ${n} SEKUNDEN!`},
            en: {300:"MAINTENANCE IN 5 MINUTES!",240:"MAINTENANCE IN 4 MINUTES!",180:"MAINTENANCE IN 3 MINUTES!",120:"MAINTENANCE IN 2 MINUTES!",60:"MAINTENANCE IN 1 MINUTE!",30:"MAINTENANCE IN 30 SECONDS!",10:"MAINTENANCE IN 10 SECONDS!",now:"MAINTENANCE!",s:n=>`MAINTENANCE IN ${n} SECONDS!`},
            es: {300:"¡MANTENIMIENTO EN 5 MINUTOS!",240:"¡MANTENIMIENTO EN 4 MINUTOS!",180:"¡MANTENIMIENTO EN 3 MINUTOS!",120:"¡MANTENIMIENTO EN 2 MINUTOS!",60:"¡MANTENIMIENTO EN 1 MINUTO!",30:"¡MANTENIMIENTO EN 30 SEGUNDOS!",10:"¡MANTENIMIENTO EN 10 SEGUNDOS!",now:"¡MANTENIMIENTO!",s:n=>`¡MANTENIMIENTO EN ${n} SEGUNDOS!`},
            fr: {300:"MAINTENANCE DANS 5 MINUTES !",240:"MAINTENANCE DANS 4 MINUTES !",180:"MAINTENANCE DANS 3 MINUTES !",120:"MAINTENANCE DANS 2 MINUTES !",60:"MAINTENANCE DANS 1 MINUTE !",30:"MAINTENANCE DANS 30 SECONDES !",10:"MAINTENANCE DANS 10 SECONDES !",now:"MAINTENANCE !",s:n=>`MAINTENANCE DANS ${n} SECONDES !`},
            it: {300:"MANUTENZIONE TRA 5 MINUTI!",240:"MANUTENZIONE TRA 4 MINUTI!",180:"MANUTENZIONE TRA 3 MINUTI!",120:"MANUTENZIONE TRA 2 MINUTI!",60:"MANUTENZIONE TRA 1 MINUTO!",30:"MANUTENZIONE TRA 30 SECONDI!",10:"MANUTENZIONE TRA 10 SECONDI!",now:"MANUTENZIONE!",s:n=>`MANUTENZIONE TRA ${n} SECONDI!`},
            tr: {300:"BAKIM 5 DAKİKA İÇİNDE!",240:"BAKIM 4 DAKİKA İÇİNDE!",180:"BAKIM 3 DAKİKA İÇİNDE!",120:"BAKIM 2 DAKİKA İÇİNDE!",60:"BAKIM 1 DAKİKA İÇİNDE!",30:"BAKIM 30 SANİYE İÇİNDE!",10:"BAKIM 10 SANİYE İÇİNDE!",now:"BAKIM!",s:n=>`BAKIM ${n} SANİYE İÇİNDE!`}
        }[lang] || null;
        if (!text) return `MAINTENANCE IN ${seconds} SECONDS!`;
        return text[seconds] || (seconds === 0 ? text.now : text.s(seconds));
    }
    function logMilestone(seconds) {
        if (!isGamePage || typeof window.addLogEntry !== "function") return;
        if (lastLoggedMark === seconds) return;
        lastLoggedMark = seconds;
        const msg = localizedCountdown(seconds);
        // Dedicated key-less entry so translated countdown wording is preserved as authored.
        window.addMaintenanceLogEntry ? window.addMaintenanceLogEntry(msg) : window.addLogEntry("maintenance.countdownCustom", "warning", { message: msg });
    }
    function handleState(state, timestamp) {
        currentState = state;
        endAt = timestamp;
        window.IDLE_ANT_MAINTENANCE_STATUS = { state, endAt, remainingSeconds: state === "COUNTDOWN" ? Math.max(0, Math.ceil((endAt-Date.now())/1000)) : null };
        const activeMaintenance = state === "MAINTENANCE" || (state === "COUNTDOWN" && endAt <= Date.now());
        const countdown = state === "COUNTDOWN" && endAt > Date.now();
        if (countdown && isGamePage) {
            const remaining = Math.max(0, Math.ceil((endAt-Date.now())/1000));
            const mark = milestones.find(s => remaining <= s && (s === 0 || remaining > s-1));
            if (mark !== undefined) logMilestone(mark);
        }
        if (isMaintenancePage) {
            if (state === "OFF") { redirecting = true; location.replace(new URL("../index.html", maintenanceDir).href); }
        } else if (activeMaintenance || countdown) {
            // Already-open game tabs are allowed to finish the countdown; new loads are redirected.
            if (!isGamePage || !firstStatusReceived) {
                redirecting = true;
                location.replace(new URL("maintenance.html", maintenanceDir).href);
            }
        }
        firstStatusReceived = true;
    }
    async function checkMaintenanceStatus() {
        if (redirecting || checkInProgress) return;
        checkInProgress = true;
        try {
            const response = await fetch(new URL("mode.js?check=" + Date.now(), maintenanceDir).href, {cache:"no-store", headers:{"Cache-Control":"no-cache"}});
            if (!response.ok) throw new Error("status unavailable");
            const config = await response.text();
            const stateMatch = config.match(/IDLE_ANT_MAINTENANCE_STATE\s*=\s*["'](OFF|COUNTDOWN|MAINTENANCE)["']/i);
            const endMatch = config.match(/IDLE_ANT_MAINTENANCE_END_AT\s*=\s*["']([^"']+)["']/i);
            const legacyMatch = config.match(/IDLE_ANT_MAINTENANCE_MODE\s*=\s*(true|false)\s*;/i);
            let state = stateMatch ? stateMatch[1].toUpperCase() : (legacyMatch && legacyMatch[1].toLowerCase()==="true" ? "MAINTENANCE" : "OFF");
            let endAt = endMatch ? Date.parse(endMatch[1]) : 0;
            if (!Number.isFinite(endAt)) endAt = 0;
            if (state === "COUNTDOWN" && !endAt) throw new Error("Countdown end timestamp missing/invalid");
            handleState(state, endAt);
        } catch (_) {
            // Bei Netzproblemen kein dauerhaftes Aussperren; nächster Check versucht es erneut.
        } finally {
            checkInProgress = false;
            if (!isMaintenancePage) document.documentElement.classList.remove("maintenance-checking");
        }
    }
    checkMaintenanceStatus();
    window.setInterval(checkMaintenanceStatus, 1000);
})();
