/* =========================
    Options-Menü (Footer)
    Enthält Sprachauswahl, Musiksteuerung und Lautstärke.

    - Die Sprachbuttons werden aus I18N.getLanguageOrder() erzeugt
      (feste, alphabetische Reihenfolge nach dem Sprachnamen).
    - Die Musik-Bedienelemente werden vom MusicController gebunden (js/musicController.js),
      hier steht nur das Öffnen/Schließen des Menüs und die Sprachauswahl.
    - Öffnen/Schließen: Options-Button, Schließen-Button, Escape, Klick außerhalb.
========================= */

const OPTIONS_MENU = {
    button: null,
    panel: null,
    closeButton: null,
    languageList: null,
    languageButtons: [],
    initialized: false
};

/* ---------- Sprachauswahl ---------- */

function buildLanguageButtons()
{
    const list = OPTIONS_MENU.languageList;

    OPTIONS_MENU.languageButtons = [];
    list.replaceChildren();

    I18N.getLanguageOrder().forEach(code =>
    {
        const info = I18N.getLanguageInfo(code);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "options-language-btn";
        button.dataset.lang = code;
        button.lang = info.htmlLang;

        const flag = document.createElement("span");
        flag.className = "options-language-flag";
        flag.setAttribute("aria-hidden", "true");
        flag.textContent = info.flag;

        const name = document.createElement("span");
        name.className = "options-language-name";
        name.textContent = info.name;

        button.append(flag, name);

        // Sprachwechsel ohne Neuladen. Spielstand und Musik bleiben unberührt.
        button.addEventListener("click", () =>
        {
            I18N.setLanguage(code);
        });

        list.appendChild(button);
        OPTIONS_MENU.languageButtons.push(button);
    });
}

function updateLanguageButtons()
{
    const current = I18N.getLanguage();

    OPTIONS_MENU.languageButtons.forEach(button =>
    {
        const isActive = button.dataset.lang === current;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

/* ---------- Öffnen / Schließen ---------- */

function isOptionsMenuOpen()
{
    return Boolean(OPTIONS_MENU.panel) && !OPTIONS_MENU.panel.hidden;
}

function openOptionsMenu()
{
    if (!OPTIONS_MENU.panel || isOptionsMenuOpen())
    {
        return;
    }

    // Es ist immer nur ein Footer-Bereich offen: Logbuch, Legende und Erfolge einklappen
    [DOM.logContainer, DOM.legendContainer, DOM.achievementContainer].forEach(container =>
    {
        if (container)
        {
            container.classList.add("collapsed");
        }
    });

    OPTIONS_MENU.panel.hidden = false;
    OPTIONS_MENU.button.setAttribute("aria-expanded", "true");

    // Fokus in das Menü setzen (aktive Sprache), damit die Tastaturbedienung direkt möglich ist
    const active = OPTIONS_MENU.languageButtons.find(button => button.classList.contains("active"));
    const target = active || OPTIONS_MENU.closeButton;

    if (target)
    {
        target.focus({ preventScroll: true });
    }
}

function closeOptionsMenu(restoreFocus = false)
{
    if (!OPTIONS_MENU.panel || !isOptionsMenuOpen())
    {
        return;
    }

    OPTIONS_MENU.panel.hidden = true;
    OPTIONS_MENU.button.setAttribute("aria-expanded", "false");

    if (restoreFocus)
    {
        OPTIONS_MENU.button.focus({ preventScroll: true });
    }
}

function toggleOptionsMenu()
{
    if (isOptionsMenuOpen())
    {
        closeOptionsMenu(true);
    }
    else
    {
        openOptionsMenu();
    }
}

/* ---------- Initialisierung (nur einmal) ---------- */

function initOptionsMenu()
{
    if (OPTIONS_MENU.initialized)
    {
        return;
    }

    OPTIONS_MENU.button = getEl("options-toggle-btn");
    OPTIONS_MENU.panel = getEl("options-menu");
    OPTIONS_MENU.closeButton = getEl("options-close-btn");
    OPTIONS_MENU.languageList = getEl("options-language-list");

    if (!OPTIONS_MENU.button || !OPTIONS_MENU.panel || !OPTIONS_MENU.closeButton || !OPTIONS_MENU.languageList)
    {
        return;
    }

    OPTIONS_MENU.initialized = true;

    buildLanguageButtons();
    updateLanguageButtons();
    I18N.onChange(updateLanguageButtons);

    OPTIONS_MENU.button.addEventListener("click", toggleOptionsMenu);

    OPTIONS_MENU.closeButton.addEventListener("click", () =>
    {
        closeOptionsMenu(true);
    });

    // Escape schließt das Menü und gibt den Fokus an den Options-Button zurück
    document.addEventListener("keydown", event =>
    {
        if (event.key === "Escape" && isOptionsMenuOpen())
        {
            event.preventDefault();
            closeOptionsMenu(true);
        }
    });

    // Klick außerhalb schließt das Menü
    document.addEventListener("click", event =>
    {
        if (!isOptionsMenuOpen())
        {
            return;
        }

        const target = event.target;

        // Element wurde während des Klicks aus dem DOM entfernt: nicht als "außerhalb" werten
        if (!(target instanceof Node) || !document.contains(target))
        {
            return;
        }

        if (!OPTIONS_MENU.panel.contains(target) && !OPTIONS_MENU.button.contains(target))
        {
            closeOptionsMenu(false);
        }
    });
}
