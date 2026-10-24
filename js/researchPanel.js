
/* =========================================================
   Idle Ant Empire — Forschungszentrum-Overlay

   Zuständig für:
   - Freischaltung des Forschungsbuttons
   - Öffnen und Schließen des Overlays
   - ESC-Taste zum Schließen
   - Kommunikation mit dem Forschungszentrum-iFrame

   Das eigentliche Forschungszentrum liegt unter:
   research/research.html
========================================================= */

(() =>
{
    "use strict";

    /* =========================
       Button-Freischaltung
    ========================= */

    function updateResearchButtonVisibility()
    {
        const button = document.getElementById("research-toggle-btn");

        if (!button)
        {
            return;
        }

        const unlocked = Boolean(
            typeof GameState !== "undefined"
            && GameState.achievements
            && GameState.achievements.knowledgeIsPower
        );

        button.hidden = !unlocked;
    }

    /*
       Global verfügbar machen, damit die bestehende
       Erfolgslogik updateResearchButtonVisibility()
       weiterhin aufrufen kann.
    */
    window.updateResearchButtonVisibility =
        updateResearchButtonVisibility;


    /* =========================
       Overlay initialisieren
    ========================= */

    function initResearchPanel()
    {
        const toggleButton =
            document.getElementById("research-toggle-btn");

        const researchPanel =
            document.getElementById("research-panel");

        const closeButton =
            document.getElementById("research-close-btn");

        const researchFrame =
            document.getElementById("research-frame");

        if (
            !toggleButton
            || !researchPanel
            || !closeButton
            || !researchFrame
        )
        {
            console.warn(
                "[ResearchPanel] Benötigte HTML-Elemente fehlen."
            );

            return;
        }

        let isOpen = false;


        /* =========================
           Öffnen
        ========================= */

        function openResearchPanel()
        {
            if (isOpen)
            {
                return;
            }

            isOpen = true;

            researchPanel.hidden = false;

            researchPanel.setAttribute(
                "aria-hidden",
                "false"
            );

            toggleButton.setAttribute(
                "aria-expanded",
                "true"
            );

            toggleButton.classList.add("active");

            closeButton.focus();

            document.dispatchEvent(
                new CustomEvent("researchPanelOpened")
            );
        }


        /* =========================
           Schließen
        ========================= */

        function closeResearchPanel()
        {
            if (!isOpen)
            {
                return;
            }

            isOpen = false;

            researchPanel.hidden = true;

            researchPanel.setAttribute(
                "aria-hidden",
                "true"
            );

            toggleButton.setAttribute(
                "aria-expanded",
                "false"
            );

            toggleButton.classList.remove("active");

            toggleButton.focus();

            document.dispatchEvent(
                new CustomEvent("researchPanelClosed")
            );
        }


        /* =========================
           Umschalten
        ========================= */

        function toggleResearchPanel()
        {
            if (isOpen)
            {
                closeResearchPanel();
            }
            else
            {
                openResearchPanel();
            }
        }


        /* =========================
           Ereignisse
        ========================= */

        toggleButton.addEventListener(
            "click",
            toggleResearchPanel
        );

        closeButton.addEventListener(
            "click",
            closeResearchPanel
        );

        document.addEventListener(
            "keydown",
            (event) =>
            {
                if (
                    event.key === "Escape"
                    && isOpen
                )
                {
                    closeResearchPanel();
                }
            }
        );


        /* =========================
           Anfangszustand
        ========================= */

        researchPanel.hidden = true;

        researchPanel.setAttribute(
            "aria-hidden",
            "true"
        );

        toggleButton.setAttribute(
            "aria-expanded",
            "false"
        );

        toggleButton.classList.remove("active");

        updateResearchButtonVisibility();


        /* =========================
           Öffentliche API
        ========================= */

        window.ResearchPanel = Object.freeze(
        {
            open: openResearchPanel,
            close: closeResearchPanel,
            toggle: toggleResearchPanel,
            isOpen: () => isOpen,
            getFrame: () => researchFrame
        });

        console.info(
            "[ResearchPanel] Forschungszentrum bereit."
        );
    }


    /* =========================
       Initialisierung starten
    ========================= */

    if (document.readyState === "loading")
    {
        document.addEventListener(
            "DOMContentLoaded",
            initResearchPanel,
            { once: true }
        );
    }
    else
    {
        initResearchPanel();
    }

})();
