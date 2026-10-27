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

    /* Anzeige der gewählten Sprache (Button, aktive Option) */

    const buttonFlag = document.getElementById("language-button-flag");
    const buttonName = document.getElementById("language-button-name");
    const languageOptions = languageMenu.querySelectorAll(".language-option[data-lang]");

    function updateLanguageDisplay() {
        const current = I18N.getLanguage();
        const info = I18N.getLanguageInfo(current);

        if (buttonFlag) {
            buttonFlag.textContent = info.flag;
        }

        if (buttonName) {
            buttonName.textContent = info.name;
        }

        languageOptions.forEach(option => {
            const isActive = option.dataset.lang === current;
            const status = option.querySelector(".language-status");

            option.classList.toggle("active", isActive);

            if (isActive) {
                option.setAttribute("aria-current", "true");
            } else {
                option.removeAttribute("aria-current");
            }

            if (status) {
                status.hidden = !isActive;
            }
        });
    }

    languageOptions.forEach(option => {
        option.addEventListener("click", () => {
            I18N.setLanguage(option.dataset.lang);
            closeLanguageMenu();
        });
    });

    I18N.onChange(updateLanguageDisplay);
    updateLanguageDisplay();

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