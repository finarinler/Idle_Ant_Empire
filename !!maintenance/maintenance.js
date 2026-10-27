/* Idle Ant Empire – Wartungsprüfung.
   Der Schalter steht in mode.js: window.IDLE_ANT_MAINTENANCE_MODE = true/false.
   Auf file:// wird die Prüfung übersprungen, damit lokales Testen weiter funktioniert. */
(() => {
    "use strict";

    const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
    if (!isHttp) return;

    const scriptUrl = document.currentScript && document.currentScript.src
        ? new URL(document.currentScript.src)
        : new URL("maintenance.js", window.location.href);
    const maintenanceDir = new URL("./", scriptUrl);
    const path = window.location.pathname.toLowerCase();
    const isMaintenancePage = path.endsWith("/!!maintenance/maintenance.html");

    if (!isMaintenancePage) {
        const style = document.createElement("style");
        style.textContent = "html.maintenance-checking body{visibility:hidden!important}";
        document.head.appendChild(style);
        document.documentElement.classList.add("maintenance-checking");
    }

    let redirecting = false;
    let checkInProgress = false;

    async function checkMaintenanceStatus() {
        if (redirecting || checkInProgress) return;
        checkInProgress = true;

        try {
            const configUrl = new URL("mode.js?check=" + Date.now(), maintenanceDir);
            const response = await fetch(configUrl.href, {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache" }
            });

            if (!response.ok) throw new Error("Wartungsschalter nicht verfügbar");

            const config = await response.text();
            const match = config.match(/IDLE_ANT_MAINTENANCE_MODE\s*=\s*(true|false)\s*;/i);
            if (!match) throw new Error("Wartungsschalter konnte nicht gelesen werden");

            const maintenanceOn = match[1].toLowerCase() === "true";

            if (isMaintenancePage) {
                if (!maintenanceOn) {
                    redirecting = true;
                    window.top.location.replace(new URL("../index.html", maintenanceDir).href);
                }
            } else if (maintenanceOn) {
                redirecting = true;
                window.top.location.replace(new URL("maintenance.html", maintenanceDir).href);
            }
        } catch (error) {
            // Bei Netzwerk-/Veröffentlichungsproblemen nicht dauerhaft aussperren.
        } finally {
            checkInProgress = false;
            if (!isMaintenancePage) {
                document.documentElement.classList.remove("maintenance-checking");
            }
        }
    }

    checkMaintenanceStatus();
    window.setInterval(checkMaintenanceStatus, 10000);
})();
