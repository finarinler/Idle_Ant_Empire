/* =========================
    Expedition: Belohnungstabellen
========================= */

function getNormalReward()
{
    const roll = Math.random() * 100;

    if (roll < 5) return 10;
    if (roll < 11) return 9;
    if (roll < 18) return 8;
    if (roll < 26) return 7;
    if (roll < 35) return 6;
    if (roll < 46) return 5;
    if (roll < 58) return 4;
    if (roll < 71) return 3;
    if (roll < 85) return 2;

    return 1;
}

function getCriticalReward()
{
    const roll = Math.random() * 100;

    if (roll < 4) return 25;
    if (roll < 9) return 24;
    if (roll < 15) return 23;
    if (roll < 22) return 22;
    if (roll < 30) return 21;
    if (roll < 39) return 20;
    if (roll < 49) return 19;
    if (roll < 60) return 18;
    if (roll < 72) return 17;
    if (roll < 85) return 16;

    return 15;
}
