/* =========================
        Formatter
========================= */

/**
 * Ganzzahl mit Tausenderpunkt (abgerundet).
 * @param {number} value
 * @param {boolean} useSuffix
 * @returns {string}
 */

function formatGameNumber(value, useSuffix = false)
{
    const num = Math.floor(value);

    if (useSuffix && num >= 10001)
    {
        const suffixes = [
            { value: 1e33, symbol: " Dc" },
            { value: 1e30, symbol: " No" },
            { value: 1e27, symbol: " Oc" },
            { value: 1e24, symbol: " Sp" },
            { value: 1e21, symbol: " Sx" },
            { value: 1e18, symbol: " Qi" },
            { value: 1e15, symbol: " Qa" },
            { value: 1e12, symbol: " T" },
            { value: 1e9,  symbol: " B" },
            { value: 1e6,  symbol: " M" },
            { value: 1e3,  symbol: " k" }
        ];

        for (let i = 0; i < suffixes.length; i++)
        {
            const item = suffixes[i];
            const next = suffixes[i - 1];

            if (num >= item.value)
            {
                const rounded = Number(
                    (num / item.value).toFixed(1)
                );

                if (rounded >= 1000 && next)
                {
                    return (num / next.value)
                        .toFixed(1)
                        .replace(".", ",") + next.symbol;
                }

                return rounded.toFixed(1)
                    .replace(".", ",") + item.symbol;
            }
        }
    }

    return num.toLocaleString("de-DE");
}

/**
 * Rate mit einer Nachkommastelle (z. B. 0,1 oder -0,4).
 * formatGameNumber() rundet ab und würde 0,1 zu 0 und -0,4 zu -1 machen.
 * @param {number} value
 * @returns {string}
 */
function formatRate(value)
{
    return value.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

/**
 * Kostenzeile für Elite-Einheiten, z. B. "150 A, 7.500 F, 2.000 L, 1 Q".
 * @param {{ants:number, food:number, larvae:number, queens:number}} cost
 * @returns {string}
 */
function formatCostLine(cost)
{
    return `${formatGameNumber(cost.ants)} A, `
        + `${formatGameNumber(cost.food)} F, `
        + `${formatGameNumber(cost.larvae)} L, `
        + `${formatGameNumber(cost.queens)} Q`;
}
