
/* =========================
    Loader: Research Achievements

    Lädt die Forschungs-Erfolge.
========================= */

const RESEARCH_ACHIEVEMENT_MODULES = [
    "js/achievements/research/knowledgeIsPower.js"
];

async function loadResearchAchievements()
{
    await loadScripts(RESEARCH_ACHIEVEMENT_MODULES);
}
