/* =========================================================
   Idle Ant Empire — HTML-Ansichtsloader
   Lädt die getrennten Bereichsdateien über versteckte iframes.
   Die Bereiche senden ihr Markup per postMessage; die Hauptseite
   setzt es in game.html ein. Kein fetch(), kein URL-Wechsel.
========================================================= */
(() => {
    "use strict";

    const SECTION_FILES = [
        { name: "expeditions", path: "expedition/expedition.html" },
        { name: "units", path: "units/units.html" },
        { name: "structures", path: "structures/structures.html" },
        { name: "military", path: "military/military.html" },
        { name: "research", path: "research/research.html" },
        { name: "logbook", path: "log/log.html" },
        { name: "achievements", path: "achievements/achievements.html" },
        { name: "statistics", path: "statistics/statistics.html" },
        { name: "options", path: "options/options.html" }
    ];

    const frames = new Map();
    let loadPromise = null;

    function resolveMarkupUrls(markup, sectionPath) {
        const template = document.createElement("template");
        template.innerHTML = markup;
        const sectionDocumentUrl = new URL(sectionPath, document.baseURI);

        template.content.querySelectorAll("[src], [href]").forEach(element => {
            for (const attribute of ["src", "href"]) {
                const value = element.getAttribute(attribute);
                if (!value || value.startsWith("#") || /^(?:[a-z]+:|\/\/)/i.test(value)) continue;
                element.setAttribute(attribute, new URL(value, sectionDocumentUrl).href);
            }
        });
        return template.content;
    }

    function receiveSection(event, pending, resolve, reject) {
        const section = [...frames.entries()].find(([, frame]) => frame.contentWindow === event.source)?.[0];
        if (!section || !event.data || typeof event.data !== "object") return;
        if (event.data.type === "iae-section-error") {
            reject(new Error(`Bereich „${section}“ konnte nicht geladen werden: ${event.data.message || "Unbekannter Fehler"}`));
            return;
        }
        if (event.data.type !== "iae-section-ready" || event.data.name !== section || typeof event.data.html !== "string") return;

        pending.set(section, event.data.html);
        if (pending.size !== SECTION_FILES.length) return;

        const mount = document.getElementById("game-main");
        if (!mount) {
            reject(new Error("Der Zielcontainer #game-main fehlt."));
            return;
        }

        SECTION_FILES.forEach(item => {
            const markup = pending.get(item.name);
            mount.appendChild(resolveMarkupUrls(markup, item.path));
        });

        frames.forEach(frame => frame.remove());
        frames.clear();
        window.removeEventListener("message", onMessage);
        resolve(true);
    }

    let activePending = null;
    let activeResolve = null;
    let activeReject = null;
    function onMessage(event) {
        if (activePending && activeResolve && activeReject) {
            receiveSection(event, activePending, activeResolve, activeReject);
        }
    }

    function loadAll() {
        if (loadPromise) return loadPromise;
        loadPromise = new Promise((resolve, reject) => {
            const pending = new Map();
            activePending = pending;
            activeResolve = resolve;
            activeReject = error => {
                window.removeEventListener("message", onMessage);
                frames.forEach(frame => frame.remove());
                frames.clear();
                reject(error);
            };
            window.addEventListener("message", onMessage);

            const timeout = window.setTimeout(() => {
                activeReject(new Error("Zeitüberschreitung beim Laden der Spielbereiche."));
            }, 20000);

            const finish = resolve;
            activeResolve = value => {
                window.clearTimeout(timeout);
                activePending = activeResolve = activeReject = null;
                finish(value);
            };

            SECTION_FILES.forEach(item => {
                const frame = document.createElement("iframe");
                frame.title = `Lade Spielbereich: ${item.name}`;
                frame.setAttribute("aria-hidden", "true");
                frame.tabIndex = -1;
                frame.style.cssText = "position:absolute;width:1px;height:1px;left:-10000px;top:-10000px;border:0;visibility:hidden";
                frame.src = item.path;
                frames.set(item.name, frame);
                frame.addEventListener("error", () => activeReject(new Error(`Datei konnte nicht geladen werden: ${item.path}`)), { once: true });
                document.body.appendChild(frame);
            });
        });
        return loadPromise;
    }

    window.GameSections = Object.freeze({ loadAll });
})();
