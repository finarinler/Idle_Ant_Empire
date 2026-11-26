
/* =========================
    Loader: Collect Achievements

    Lädt die Sammel-Erfolge.
========================= */

const COLLECT_ACHIEVEMENT_MODULES = [
    "achievements/js/collect/smallCollector.js",
    "achievements/js/collect/collectorTen.js",
    "achievements/js/collect/collector25.js",
    "achievements/js/collect/collectorFifty.js",
    "achievements/js/collect/collectorHundred.js",
    "achievements/js/collect/collector250.js",
    "achievements/js/collect/goldenAge.js",
];

async function loadCollectAchievements()
{
    await loadScripts(COLLECT_ACHIEVEMENT_MODULES);
}
