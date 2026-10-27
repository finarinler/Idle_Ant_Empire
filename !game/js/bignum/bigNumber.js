/* =========================
    Big-Number-System
    Zentrale Zahlenklasse für alle Spielwerte.

    Darstellung: Vorzeichen-Mantisse m (15 signifikante Stellen, 1 <= |m| < 10)
    und ganzzahliger Zehnerexponent e  ->  Wert = m * 10^e.

    - Exponenten bis +/-1e300 werden unterstützt (Werte bis 10^(10^300), weit jenseits von 1e308;
      ab Exponent 9e15 nur noch größenordnungsmäßig genau).
    - Darüber hinaus gilt: echtes Infinity (e === Infinity) bzw. 0.
    - Ganzzahlen bis 1e15 bleiben exakt (15 Mantissenstellen).
    - Instanzen sind unveränderlich (immutable).
    - NaN kann nicht entstehen: ungültige Eingaben werden zu 0
      (BigNum.tryFrom() meldet sie stattdessen als null).
    - Native Operatoren (+, >=, ...) sind absichtlich gesperrt (valueOf wirft),
      damit versehentliche Number-Rechnung sofort auffällt.
========================= */

(function (root)
{
    "use strict";

    const MANTISSA_DIGITS = 15;
    // Exponenten sind selbst native Zahlen: bis 9e15 ganzzahlig exakt, darüber hinaus nur noch
    // größenordnungsmäßig genau (für Spielwerte dieser Größe bedeutungslos).
    const MAX_EXPONENT = 1e300;
    const NATIVE_EXP_LIMIT = 14;   // |e| <= 14: native Rechnung ist exakt genug

    class BigNum
    {
        constructor(m, e)
        {
            this.m = m;
            this.e = e;
            Object.freeze(this);
        }

        /* ---------- Erzeugung ---------- */

        static from(value)
        {
            const result = BigNum.tryFrom(value);
            return result === null ? ZERO : result;
        }

        /** Wie from(), liefert bei ungültiger Eingabe aber null (statt 0). */
        static tryFrom(value)
        {
            if (value instanceof BigNum)
            {
                return value;
            }

            switch (typeof value)
            {
                case "number":
                    return fromNumber(value);

                case "bigint":
                    return parse(value.toString());

                case "string":
                    return parse(value);

                case "object":
                    if (
                        value !== null
                        && typeof value.m === "number"
                        && typeof value.e === "number"
                        && !Number.isNaN(value.m)
                        && !Number.isNaN(value.e)
                    )
                    {
                        return make(value.m, value.e);
                    }
                    return null;

                default:
                    return null;
            }
        }

        static isBigNum(value)
        {
            return value instanceof BigNum;
        }

        static min(a, b)
        {
            const x = BigNum.from(a);
            const y = BigNum.from(b);
            return x.cmp(y) <= 0 ? x : y;
        }

        static max(a, b)
        {
            const x = BigNum.from(a);
            const y = BigNum.from(b);
            return x.cmp(y) >= 0 ? x : y;
        }

        /* ---------- Eigenschaften ---------- */

        isZero()      { return this.m === 0; }
        isNegative()  { return this.m < 0; }
        isPositive()  { return this.m > 0; }
        isInfinite()  { return this.e === Infinity; }
        isFinite()    { return this.e !== Infinity; }

        /* ---------- Vorzeichen ---------- */

        neg()
        {
            return this.m === 0 ? this : new BigNum(-this.m, this.e);
        }

        abs()
        {
            return this.m < 0 ? new BigNum(-this.m, this.e) : this;
        }

        /* ---------- Vergleiche ---------- */

        /** -1, 0 oder 1 */
        cmp(other)
        {
            const o = BigNum.from(other);
            const signA = Math.sign(this.m);
            const signB = Math.sign(o.m);

            if (signA !== signB)
            {
                return signA < signB ? -1 : 1;
            }

            if (signA === 0)
            {
                return 0;
            }

            if (this.e !== o.e)
            {
                const byExponent = this.e < o.e ? -1 : 1;
                return signA > 0 ? byExponent : -byExponent;
            }

            if (this.m === o.m)
            {
                return 0;
            }

            return this.m < o.m ? -1 : 1;
        }

        eq(other)  { return this.cmp(other) === 0; }
        lt(other)  { return this.cmp(other) < 0; }
        lte(other) { return this.cmp(other) <= 0; }
        gt(other)  { return this.cmp(other) > 0; }
        gte(other) { return this.cmp(other) >= 0; }

        /* ---------- Grundrechenarten ---------- */

        add(other)
        {
            const o = BigNum.from(other);

            if (this.m === 0) { return o; }
            if (o.m === 0)    { return this; }

            if (this.e === Infinity || o.e === Infinity)
            {
                if (this.e === Infinity && o.e === Infinity && this.m !== o.m)
                {
                    return ZERO;   // Infinity - Infinity ist undefiniert
                }

                return this.e === Infinity ? this : o;
            }

            // Kleiner Wertebereich: native Rechnung ist exakt (Ganzzahlen) bzw. wie bisher
            if (
                Math.abs(this.e) <= NATIVE_EXP_LIMIT
                && Math.abs(o.e) <= NATIVE_EXP_LIMIT
            )
            {
                return fromNumber(this.toNumber() + o.toNumber());
            }

            let a = this;
            let b = o;

            if (a.e < b.e || (a.e === b.e && Math.abs(a.m) < Math.abs(b.m)))
            {
                a = o;
                b = this;
            }

            const diff = a.e - b.e;

            // b liegt unterhalb der Mantissengenauigkeit von a
            if (diff >= MANTISSA_DIGITS + 2)
            {
                return a;
            }

            return make(a.m + b.m * Math.pow(10, -diff), a.e);
        }

        sub(other)
        {
            return this.add(BigNum.from(other).neg());
        }

        mul(other)
        {
            const o = BigNum.from(other);

            if (this.m === 0 || o.m === 0)
            {
                return ZERO;   // inkl. 0 * Infinity (undefiniert -> 0)
            }

            if (this.e === Infinity || o.e === Infinity)
            {
                return Math.sign(this.m) * Math.sign(o.m) > 0 ? POS_INF : NEG_INF;
            }

            return make(this.m * o.m, this.e + o.e);
        }

        /**
         * Division. Division durch 0 liefert +/-Infinity (0 / 0 liefert 0).
         * Spielcode darf nie durch 0 teilen; der Rückgabewert ist nur ein
         * definierter Sonderfall statt NaN.
         */
        div(other)
        {
            const o = BigNum.from(other);

            if (o.m === 0)
            {
                if (this.m === 0) { return ZERO; }
                return this.m > 0 ? POS_INF : NEG_INF;
            }

            if (this.m === 0)
            {
                return ZERO;
            }

            if (this.e === Infinity && o.e === Infinity)
            {
                return ZERO;   // Infinity / Infinity ist undefiniert
            }

            if (this.e === Infinity)
            {
                return Math.sign(this.m) * Math.sign(o.m) > 0 ? POS_INF : NEG_INF;
            }

            if (o.e === Infinity)
            {
                return ZERO;
            }

            return make(this.m / o.m, this.e - o.e);
        }

        /** this ^ exponent (Exponent: Zahl, String oder BigNum) */
        pow(exponent)
        {
            const x = BigNum.from(exponent);

            if (x.m === 0) { return ONE; }

            if (this.m === 0)
            {
                return x.m > 0 ? ZERO : POS_INF;
            }

            if (this.e === 0 && this.m === 1) { return ONE; }

            // Negative Basis: nur ganzzahlige Exponenten sind definiert
            if (this.m < 0)
            {
                const n = x.toNumber();

                if (!Number.isInteger(n))
                {
                    return ZERO;
                }

                const magnitude = this.abs().pow(x);
                return n % 2 === 0 ? magnitude : magnitude.neg();
            }

            // Bisheriges Verhalten (Math.pow) im nativen Bereich beibehalten
            const nativeBase = this.toNumber();
            const nativeExp = x.toNumber();

            if (Number.isFinite(nativeBase) && Number.isFinite(nativeExp))
            {
                const result = Math.pow(nativeBase, nativeExp);

                if (
                    Number.isFinite(result)
                    && result !== 0
                    && result < 1e300
                    && result > 1e-300
                )
                {
                    return fromNumber(result);
                }
            }

            // Logarithmischer Weg für riesige / winzige Ergebnisse
            const exponentNumber = x.e === Infinity
                ? (x.m > 0 ? Infinity : -Infinity)
                : nativeExp;

            const baseLog = this.e === Infinity
                ? Infinity
                : this.e + Math.log10(this.m);

            if (baseLog === 0)
            {
                return ONE;
            }

            const total = baseLog * (Number.isFinite(exponentNumber) ? exponentNumber : exponentNumber);

            if (Number.isNaN(total))
            {
                return ZERO;
            }

            if (total === Infinity)   { return POS_INF; }
            if (total === -Infinity)  { return ZERO; }

            const whole = Math.floor(total);
            const fraction = total - whole;

            return make(Math.pow(10, fraction), whole);
        }

        sqrt()
        {
            return this.m <= 0 ? ZERO : this.pow(0.5);
        }

        /** Zehnerlogarithmus als Number (<= 0 liefert -Infinity). */
        log10()
        {
            if (this.m <= 0) { return -Infinity; }
            if (this.e === Infinity) { return Infinity; }
            return this.e + Math.log10(this.m);
        }

        /* ---------- Runden ---------- */

        floor()
        {
            if (this.m === 0 || this.e >= MANTISSA_DIGITS) { return this; }
            if (this.e < -300) { return this.m < 0 ? NEG_ONE : ZERO; }
            return fromNumber(Math.floor(this.toNumber()));
        }

        ceil()
        {
            if (this.m === 0 || this.e >= MANTISSA_DIGITS) { return this; }
            if (this.e < -300) { return this.m > 0 ? ONE : ZERO; }
            return fromNumber(Math.ceil(this.toNumber()));
        }

        /** Rundet wie Math.round (x,5 wird aufgerundet). */
        round()
        {
            if (this.m === 0 || this.e >= MANTISSA_DIGITS) { return this; }
            if (this.e < -300) { return ZERO; }
            return fromNumber(Math.round(this.toNumber()));
        }

        /** Rundet auf eine feste Zahl von Nachkommastellen. */
        roundTo(decimals)
        {
            if (this.m === 0 || this.e >= MANTISSA_DIGITS - decimals) { return this; }
            const factor = Math.pow(10, decimals);
            return fromNumber(Math.round(this.toNumber() * factor) / factor);
        }

        /* ---------- Umwandlung ---------- */

        /** Native Zahl (kann bei sehr großen Werten Infinity bzw. bei winzigen 0 liefern). */
        toNumber()
        {
            if (this.m === 0) { return 0; }
            if (this.e === Infinity) { return this.m > 0 ? Infinity : -Infinity; }
            if (this.e > 308) { return this.m > 0 ? Infinity : -Infinity; }
            if (this.e < -324) { return 0; }
            return Number(this.m + "e" + this.e);
        }

        /** Serialisierung: "<Mantisse>e<Exponent>", "0", "Infinity" oder "-Infinity". */
        toString()
        {
            if (this.m === 0) { return "0"; }
            if (this.e === Infinity) { return this.m > 0 ? "Infinity" : "-Infinity"; }
            return this.m + "e" + this.e;
        }

        toJSON()
        {
            return this.toString();
        }

        valueOf()
        {
            throw new TypeError(
                "BigNum: native Operatoren sind nicht erlaubt. Verwende add/sub/mul/div/cmp/gte/... statt +, -, >= usw."
            );
        }

        [Symbol.toPrimitive](hint)
        {
            if (hint === "string")
            {
                return this.toString();
            }

            return this.valueOf();
        }
    }

    /* ---------- Interne Hilfsfunktionen ---------- */

    const ZERO = Object.freeze(new BigNum(0, 0));
    const ONE = Object.freeze(new BigNum(1, 0));
    const NEG_ONE = Object.freeze(new BigNum(-1, 0));
    const POS_INF = Object.freeze(new BigNum(1, Infinity));
    const NEG_INF = Object.freeze(new BigNum(-1, Infinity));

    /**
     * Normalisiert (m, e) auf 15 signifikante Mantissenstellen mit 1 <= |m| < 10.
     * Ungültige Werte (NaN) werden zu 0.
     */
    function make(m, e)
    {
        if (Number.isNaN(m) || Number.isNaN(e)) { return ZERO; }
        if (m === 0)                            { return ZERO; }

        if (!Number.isFinite(m))
        {
            return m > 0 ? POS_INF : NEG_INF;
        }

        if (e === Infinity)  { return m > 0 ? POS_INF : NEG_INF; }
        if (e === -Infinity) { return ZERO; }

        const text = m.toExponential(MANTISSA_DIGITS - 1);
        const index = text.indexOf("e");
        const mantissa = Number(text.slice(0, index));
        const exponent = e + Number(text.slice(index + 1));

        if (exponent > MAX_EXPONENT)  { return mantissa > 0 ? POS_INF : NEG_INF; }
        if (exponent < -MAX_EXPONENT) { return ZERO; }

        return new BigNum(mantissa, exponent);
    }

    function fromNumber(value)
    {
        if (Number.isNaN(value)) { return null; }
        if (value === Infinity)  { return POS_INF; }
        if (value === -Infinity) { return NEG_INF; }
        if (value === 0)         { return ZERO; }

        return make(value, 0);
    }

    const NUMBER_PATTERN = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/;

    /** Liest Dezimal- und Exponentialschreibweise beliebiger Länge. Ungültig -> null. */
    function parse(text)
    {
        const input = text.trim();

        if (input === "Infinity" || input === "+Infinity") { return POS_INF; }
        if (input === "-Infinity")                         { return NEG_INF; }

        const match = NUMBER_PATTERN.exec(input);

        if (!match)
        {
            return null;
        }

        const sign = match[1] === "-" ? -1 : 1;
        const integerPart = match[2] !== undefined ? match[2] : "";
        const fractionPart = match[3] !== undefined ? match[3] : (match[4] || "");
        const exponentPart = match[5] !== undefined ? Number(match[5]) : 0;

        const digits = integerPart + fractionPart;
        const firstNonZero = digits.search(/[1-9]/);

        if (firstNonZero === -1)
        {
            return ZERO;
        }

        const firstDigitExponent = integerPart.length - firstNonZero - 1 + exponentPart;
        const significant = digits.slice(firstNonZero, firstNonZero + 17);
        const mantissa = Number(significant[0] + "." + (significant.slice(1) || "0"));

        return make(sign * mantissa, firstDigitExponent);
    }

    /* ---------- Export ---------- */

    function Big(value)
    {
        return BigNum.from(value);
    }

    BigNum.ZERO = ZERO;
    BigNum.ONE = ONE;
    BigNum.POSITIVE_INFINITY = POS_INF;
    BigNum.NEGATIVE_INFINITY = NEG_INF;
    BigNum.MAX_EXPONENT = MAX_EXPONENT;
    BigNum.MANTISSA_DIGITS = MANTISSA_DIGITS;

    root.BigNum = BigNum;
    root.Big = Big;

    if (typeof module !== "undefined" && module.exports)
    {
        module.exports = { BigNum, Big };
    }
})(typeof window !== "undefined" ? window : globalThis);
