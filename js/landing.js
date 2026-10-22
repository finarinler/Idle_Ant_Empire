/* =========================
   Landing Page Logic
========================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       Current Year
    ========================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =========================
       Language Dropdown
    ========================= */

    const languageButton = document.getElementById("language-button");
    const languageMenu = document.getElementById("language-menu");

    if (!languageButton || !languageMenu) {
        return;
    }

    function openLanguageMenu() {
        languageMenu.hidden = false;
        languageButton.setAttribute("aria-expanded", "true");
    }

    function closeLanguageMenu() {
        languageMenu.hidden = true;
        languageButton.setAttribute("aria-expanded", "false");
    }

    languageButton.addEventListener("click", () => {
        const isExpanded =
            languageButton.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
            closeLanguageMenu();
        } else {
            openLanguageMenu();
        }
    });

    /* Close when clicking outside */

    document.addEventListener("click", (event) => {
        const clickedInsideButton = languageButton.contains(event.target);
        const clickedInsideMenu = languageMenu.contains(event.target);

        if (!clickedInsideButton && !clickedInsideMenu) {
            closeLanguageMenu();
        }
    });

    /* Close with Escape */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLanguageMenu();
            languageButton.focus();
        }
    });
});