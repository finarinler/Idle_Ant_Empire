
/* =========================
        Formatter
        Zentrale Zahlenformatierung für sämtliche angezeigten Werte.
        Die interne Zahl (BigNum) ist sprachunabhängig, nur die Ausgabe
        richtet sich nach der gewählten Sprache (Dezimal-/Tausendertrenner).
========================= */

// Index = Zehnerpotenz / 3  (1e3 = k, 1e6 = M, ... 1e60 = NoDc)
const NUMBER_SUFFIXES = [
    "", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
    "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc"
];

// Ab dieser Größe (10^66) wird wissenschaftliche Schreibweise verwendet
const SCIENTIFIC_EXPONENT_START = 66;

// Ab dieser Größe werden Suffixe statt ausgeschriebener Zahlen verwendet
const SUFFIX_START = 10001;

// Anzeige für ungültige Werte (statt "NaN" als scheinbar gültige Ressource)
const INVALID_NUMBER_TEXT = "–";

/* ---------- Trennzeichen je Sprache ---------- */

function getNumberSeparators()
{
    const info = typeof I18N !== "undefined" ? I18N.getLanguageInfo() : null;

    return {
        decimal: info ? info.decimal : ",",
        group: info ? info.group : "."
    };
}

function groupDigits(digits, separator)
{
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/* ---------- Eingabe prüfen ---------- */

let warnedInvalidNumber = false;

/** Wandelt eine Eingabe in BigNum um. Ungültige Werte (NaN, undefined, ...) ergeben null. */
function toBigNumOrNull(value)
{
    const big = BigNum.tryFrom(value);

    if (big === null && !warnedInvalidNumber)
    {
        warnedInvalidNumber = true;
        console.warn("[Formatter] Ungültiger Zahlenwert wurde nicht angezeigt:", value);
    }

    return big;
}

/* ---------- Bausteine ---------- */

/** Mantisse mit 2 Nachkommastellen; fängt das Aufrunden auf 10,00 ab. */
function scientificParts(abs)
{
    let mantissa = abs.m.toFixed(2);
    let exponent = abs.e;

    if (Number(mantissa) >= 10)
    {
        mantissa = (Number(mantissa) / 10).toFixed(2);
        exponent += 1;
    }

    return { mantissa, exponent };
}

/** Exponent lesbar ausgeben; sehr große Exponenten werden selbst wissenschaftlich dargestellt. */
function formatExponent(exponent, decimalSeparator)
{
    if (exponent < 1e9)
    {
        return String(exponent);
    }

    const exponentBig = BigNum.from(exponent);
    const parts = scientificParts(exponentBig);

    return `(${parts.mantissa.replace(".", decimalSeparator)}e${parts.exponent})`;
}

function formatScientific(abs, negative)
{
    const { decimal } = getNumberSeparators();
    const parts = scientificParts(abs);

    return (negative ? "-" : "")
        + parts.mantissa.replace(".", decimal)
        + "e"
        + formatExponent(parts.exponent, decimal);
}

/** Ausgeschriebene Ganzzahl (abs ist bereits abgerundet) mit Tausendertrenner. */
function formatWholeNumber(abs, negative)
{
    const { group } = getNumberSeparators();
    let digits;

    if (abs.e < 15)
    {
        digits = String(abs.toNumber());
    }
    else
    {
        // 15 gültige Mantissenstellen, aufgefüllt mit Nullen
        const mantissaDigits = abs.m.toFixed(14).replace(".", "");
        digits = mantissaDigits + "0".repeat(abs.e - 14);
    }

    return (negative ? "-" : "") + groupDigits(digits, group);
}

function formatWithSuffix(abs, negative)
{
    const { decimal } = getNumberSeparators();
    const topIndex = NUMBER_SUFFIXES.length - 1;

    let index = Math.min(Math.floor(abs.e / 3), topIndex);
    let scaled = abs.m * Math.pow(10, abs.e - index * 3);
    let rounded = Number(scaled.toFixed(1));

    // Auf das nächste Suffix wechseln, falls die gerundete Zahl 1.000 erreicht.
    if (rounded >= 1000 && index < topIndex)
    {
        index += 1;
        scaled = scaled / 1000;
        rounded = Number(scaled.toFixed(1));
    }

    const text = (negative ? "-" : "") + rounded.toFixed(1).replace(".", decimal);

    return text + NUMBER_SUFFIXES[index];
}

/* ---------- Öffentliche Funktionen ---------- */

/**
 * Ganzzahl (abgerundet) mit Tausendertrenner.
 * Optional mit Zahlensuffix (k, M, B, ...) bzw. wissenschaftlicher Schreibweise.
 *
 * @param {BigNum|number|string} value
 * @param {boolean} useSuffix
 * @returns {string}
 */
function formatGameNumber(value, useSuffix = true)
{
    const big = toBigNumOrNull(value);

    if (big === null)
    {
        return INVALID_NUMBER_TEXT;
    }

    if (big.isInfinite())
    {
        return big.isPositive() ? "∞" : "-∞";
    }

    const num = big.floor();

    if (num.isZero())
    {
        return "0";
    }

    const negative = num.isNegative();
    const abs = num.abs();

    // Wissenschaftliche Schreibweise ab 10^66
    // (ohne Suffixe, d. h. useSuffix=false, erst wenn die Ziffern nicht mehr sinnvoll lesbar sind)
    if (useSuffix ? abs.e >= SCIENTIFIC_EXPONENT_START : abs.e >= 21)
    {
        return formatScientific(abs, negative);
    }

    // Zahlensuffixe ab 10.001
    if (useSuffix && abs.gte(SUFFIX_START))
    {
        return formatWithSuffix(abs, negative);
    }

    return formatWholeNumber(abs, negative);
}

/**
 * Dezimalzahl mit fester Anzahl Nachkommastellen (z. B. 0,25 bzw. 0.25).
 * Für Konfigurationswerte und Raten im normalen Zahlenbereich.
 */
function formatDecimal(value, decimals = 1)
{
    const big = toBigNumOrNull(value);

    if (big === null)
    {
        return INVALID_NUMBER_TEXT;
    }

    if (big.isInfinite() || big.abs().gte(1e15))
    {
        return formatGameNumber(big);
    }

    const { decimal, group } = getNumberSeparators();
    const fixed = big.toNumber().toFixed(decimals);
    const negative = fixed.startsWith("-") && Number(fixed) !== 0;
    const [whole, fraction] = fixed.replace("-", "").split(".");

    return (negative ? "-" : "")
        + groupDigits(whole, group)
        + (fraction ? decimal + fraction : "");
}

/**
 * Rate mit einer Nachkommastelle.
 *
 * @param {BigNum|number} value
 * @returns {string}
 */
function formatRate(value)
{
    return formatDecimal(value, 1);
}

/* ---------- Ressourcen-Kürzel (gold) ---------- */

const RESOURCE_ABBREVIATIONS = {
    ants: "A",
    food: "F",
    larvae: "L",
    queens: "Q"
};

/**
 * Baut ein DocumentFragment "<Zahl> <Kürzel>, <Zahl> <Kürzel>, ...".
 * Das Kürzel erhält die bestehende Klasse "abbr-gold" (sichere DOM-Erzeugung).
 *
 * @param {Object} cost   z. B. { ants, food, larvae, queens }
 * @param {string[]} order  Reihenfolge der Ressourcen
 */
function buildCostFragment(cost, order)
{
    const fragment = document.createDocumentFragment();

    order.forEach((resource, index) =>
    {
        if (index > 0)
        {
            fragment.appendChild(document.createTextNode(", "));
        }

        fragment.appendChild(document.createTextNode(formatGameNumber(cost[resource] || 0) + " "));

        const abbr = document.createElement("span");
        abbr.className = "abbr-gold";
        abbr.textContent = RESOURCE_ABBREVIATIONS[resource];
        fragment.appendChild(abbr);
    });

    return fragment;
}

/**
 * Schreibt eine Kostenzeile in ein Element. Nur bei Änderung wird neu gezeichnet
 * (wird jeden Tick aufgerufen), die goldenen Kürzel bleiben dadurch stabil.
 */
function renderCostLine(element, cost, order = ["ants", "food", "larvae", "queens"])
{
    if (!element)
    {
        return;
    }

    const signature = order
        .map(resource => RESOURCE_ABBREVIATIONS[resource] + ":" + formatGameNumber(cost[resource] || 0))
        .join("|") + "@" + I18N.getLanguage();

    if (element.dataset.costSignature === signature)
    {
        return;
    }

    element.dataset.costSignature = signature;
    element.replaceChildren(buildCostFragment(cost, order));
}

if (typeof module !== "undefined" && module.exports)
{
    module.exports = { formatGameNumber, formatDecimal, formatRate, NUMBER_SUFFIXES };
}
