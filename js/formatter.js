/* =========================
    Number Formatter Logic
========================= */

/**

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
            { value: 1e12, symbol: " T" },
            { value: 1e9,  symbol: " B" }, 
            { value: 1e6,  symbol: " M" }, 
            { value: 1e3,  symbol: " k" }  
        ];

        const item = suffixes.find(item => num >= item.value);
        if (item)
        {
            return (num / item.value).toFixed(1).replace(".", ",") + item.symbol;
        }
    }

    return num.toLocaleString("de-DE");
}