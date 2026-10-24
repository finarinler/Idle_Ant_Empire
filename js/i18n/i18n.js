/* =========================
    Mehrsprachigkeit (i18n)
    Logik: Sprache wählen / speichern, Texte auflösen, DOM aktualisieren.
    Die Übersetzungsdaten liegen getrennt in de.js, en.js, es.js, fr.js, it.js und tr.js.

    Wird per normalem <script>-Tag geladen (kein fetch / keine Module),
    damit das Spiel auch direkt über file:// funktioniert.

    Platzhalter in Texten:  {name}        -> Parameter
    Ressourcen-Kürzel:      [[F]]         -> <span class="abbr-gold">F</span>
    Zeilenumbruch:          \n            -> <br>
========================= */

const I18N = (function ()
{
    "use strict";

    const DEFAULT_LANGUAGE = "de";
    const STORAGE_KEY = "ant_empire_language";

    // Anzeigedaten der wählbaren Sprachen (Namen bleiben in der Landessprache)
    const LANGUAGES = {
        de: { name: "Deutsch",  flag: "🇩🇪", htmlLang: "de", localeTag: "de-DE", decimal: ",", group: "." },
        en: { name: "English",  flag: "🇬🇧", htmlLang: "en", localeTag: "en-GB", decimal: ".", group: "," },
        es: { name: "Español",  flag: "🇪🇸", htmlLang: "es", localeTag: "es-ES", decimal: ",", group: "." },
        fr: { name: "Français", flag: "🇫🇷", htmlLang: "fr", localeTag: "fr-FR", decimal: ",", group: "\u00a0" },
        it: { name: "Italiano", flag: "🇮🇹", htmlLang: "it", localeTag: "it-IT", decimal: ",", group: "." },
        tr: { name: "Türkçe",   flag: "🇹🇷", htmlLang: "tr", localeTag: "tr-TR", decimal: ",", group: "." }
    };

    // Feste Reihenfolge der Sprachauswahl: alphabetisch nach dem ausgeschriebenen
    // Sprachnamen (Deutsch, English, Español, Français, Italiano, Türkçe) – NICHT nach Code.
    // Bewusst als feste Liste (statt Laufzeit-Sortierung), damit die Reihenfolge in jedem
    // Browser und nach jedem Sprachwechsel identisch bleibt. Der Unit-Test prüft, dass
    // diese Liste mit der alphabetischen Sortierung der Namen übereinstimmt.
    const LANGUAGE_ORDER = Object.freeze(["de", "en", "es", "fr", "it", "tr"]);

    const dictionaries = {};
    const listeners = [];
    const warnedKeys = new Set();

    let currentLanguage = DEFAULT_LANGUAGE;

    /* ---------- Registrierung ---------- */

    function register(language, entries)
    {
        dictionaries[language] = Object.assign(dictionaries[language] || {}, entries);
    }

    function isSupported(language)
    {
        return Object.prototype.hasOwnProperty.call(LANGUAGES, language);
    }

    /* ---------- Speicherung (unabhängig vom Spielstand) ---------- */

    function readStoredLanguage()
    {
        try
        {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            return isSupported(stored) ? stored : null;
        }
        catch (error)
        {
            return null;
        }
    }

    function storeLanguage(language)
    {
        try
        {
            window.localStorage.setItem(STORAGE_KEY, language);
        }
        catch (error)
        {
            console.warn("[i18n] Sprache konnte nicht gespeichert werden:", error);
        }
    }

    /* ---------- Übersetzen ---------- */

    function lookup(language, key)
    {
        const dictionary = dictionaries[language];
        return dictionary && typeof dictionary[key] === "string" ? dictionary[key] : null;
    }

    function formatParam(value)
    {
        // Verschachtelte Übersetzung: { key, params }
        if (value !== null && typeof value === "object" && typeof value.key === "string")
        {
            return translate(value.key, value.params);
        }

        // Zahlen (auch BigNum) werden einheitlich über den zentralen Formatter ausgegeben
        if (
            typeof value === "number"
            || (typeof BigNum !== "undefined" && value instanceof BigNum)
        )
        {
            return typeof formatGameNumber === "function"
                ? formatGameNumber(value)
                : String(value);
        }

        return String(value);
    }

    /**
     * Liefert den Text zum Schlüssel in der aktuellen Sprache.
     * Fallback: Deutsch. Ist der Schlüssel gar nicht vorhanden, wird der
     * Schlüssel selbst (nie "undefined") zurückgegeben und einmalig gewarnt.
     */
    function translate(key, params)
    {
        let text = lookup(currentLanguage, key);

        if (text === null)
        {
            text = lookup(DEFAULT_LANGUAGE, key);

            if (text === null)
            {
                if (!warnedKeys.has(key))
                {
                    warnedKeys.add(key);
                    console.warn(`[i18n] Übersetzungsschlüssel fehlt: "${key}"`);
                }

                return String(key);
            }
        }

        if (!params)
        {
            return text;
        }

        return text.replace(/\{(\w+)\}/g, (match, name) =>
            Object.prototype.hasOwnProperty.call(params, name)
                ? formatParam(params[name])
                : match
        );
    }

    /** Wie translate(), aber ohne [[X]]-Markierungen (für title-/aria-Attribute). */
    function translatePlain(key, params)
    {
        return translate(key, params).replace(/\[\[([^\]]+)\]\]/g, "$1");
    }

    /* ---------- Sichere DOM-Ausgabe ---------- */

    /**
     * Baut aus einem Text ein DocumentFragment:
     * [[X]] -> gold hervorgehobenes Kürzel, \n -> <br>. Alles andere bleibt reiner Text
     * (kein innerHTML, daher kein HTML-Einschleusen möglich).
     */
    function buildFragment(text)
    {
        const fragment = document.createDocumentFragment();
        const pattern = /\[\[([^\]]+)\]\]|\n/g;

        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(text)) !== null)
        {
            if (match.index > lastIndex)
            {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            if (match[0] === "\n")
            {
                fragment.appendChild(document.createElement("br"));
            }
            else
            {
                const abbr = document.createElement("span");
                abbr.className = "abbr-gold";
                abbr.textContent = match[1];
                fragment.appendChild(abbr);
            }

            lastIndex = pattern.lastIndex;
        }

        if (lastIndex < text.length)
        {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        return fragment;
    }

    /** Schreibt einen bereits aufgelösten Text sicher in ein Element. */
    function renderInto(element, text)
    {
        if (!element)
        {
            return;
        }

        if (/\[\[|\n/.test(text))
        {
            element.replaceChildren(buildFragment(text));
        }
        else
        {
            element.textContent = text;
        }
    }

    /**
     * Setzt den übersetzten Text eines Elements, aber nur wenn sich Sprache,
     * Schlüssel oder Parameter geändert haben (wird jeden Tick aufgerufen).
     */
    function setText(element, key, params)
    {
        if (!element)
        {
            return;
        }

        const text = translate(key, params);
        const signature = currentLanguage + "\u0000" + key + "\u0000" + text;

        if (element.dataset.i18nSignature === signature)
        {
            return;
        }

        element.dataset.i18nSignature = signature;
        renderInto(element, text);
    }

    /* ---------- Statische Texte im HTML ---------- */

    function applyStatic(root)
    {
        if (typeof document === "undefined")
        {
            return;
        }

        const scope = root || document;

        scope.querySelectorAll("[data-i18n]").forEach(element =>
        {
            renderInto(element, translate(element.dataset.i18n));
        });

        const attributeMap = [
            ["data-i18n-title", "title"],
            ["data-i18n-aria-label", "aria-label"],
            ["data-i18n-content", "content"],
            ["data-i18n-alt", "alt"]
        ];

        attributeMap.forEach(([dataAttribute, attribute]) =>
        {
            scope.querySelectorAll(`[${dataAttribute}]`).forEach(element =>
            {
                element.setAttribute(attribute, translatePlain(element.getAttribute(dataAttribute)));
            });
        });

        if (document.documentElement)
        {
            document.documentElement.lang = LANGUAGES[currentLanguage].htmlLang;
        }
    }

    /* ---------- Sprache wechseln ---------- */

    function setLanguage(language)
    {
        if (!isSupported(language))
        {
            console.warn(`[i18n] Nicht unterstützte Sprache: "${language}"`);
            return false;
        }

        const changed = language !== currentLanguage;

        currentLanguage = language;
        storeLanguage(language);
        applyStatic();

        listeners.slice().forEach(listener =>
        {
            try
            {
                listener(language, changed);
            }
            catch (error)
            {
                console.error("[i18n] Fehler in Sprachwechsel-Listener:", error);
            }
        });

        return true;
    }

    function onChange(listener)
    {
        listeners.push(listener);
    }

    function getLanguage()
    {
        return currentLanguage;
    }

    function getLanguageInfo(language)
    {
        return LANGUAGES[language || currentLanguage];
    }

    /** Sprachcodes in der festen, alphabetischen Anzeigereihenfolge. */
    function getLanguageOrder()
    {
        return LANGUAGE_ORDER.slice();
    }

    /* ---------- Initialisierung ---------- */

    function init()
    {
        // Erster Start: Deutsch. Danach die zuletzt gewählte Sprache.
        currentLanguage = readStoredLanguage() || DEFAULT_LANGUAGE;

        if (typeof document === "undefined")
        {
            return;
        }

        const apply = () => applyStatic();

        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", apply);
        }
        else
        {
            apply();
        }
    }

    return {
        DEFAULT_LANGUAGE,
        STORAGE_KEY,
        LANGUAGES,
        LANGUAGE_ORDER,
        register,
        init,
        t: translate,
        tPlain: translatePlain,
        setText,
        renderInto,
        buildFragment,
        applyStatic,
        setLanguage,
        onChange,
        getLanguage,
        getLanguageInfo,
        getLanguageOrder,
        isSupported,
        getDictionary: language => dictionaries[language] || {}
    };
})();

I18N.init();

if (typeof module !== "undefined" && module.exports)
{
    module.exports = I18N;
}
