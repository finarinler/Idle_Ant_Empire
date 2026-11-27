/* =========================
    Erfolge: Registry

    Aufbau einer Definition:
    {
        id:        Schlüssel in GameState.achievements,
        order:     Reihenfolge in der Erfolgsliste,
        getProgress: () => ({ current, goal, textKey?, textParams? })
                     // current / goal: Zahl oder BigNum
                     // freigeschaltet, sobald current >= goal
                     // textKey/textParams: optionaler Fortschrittstext (Übersetzungsschlüssel)
        onUnlock:  (restored) => {}          // optional
                     // restored = true, wenn der Erfolg nur aus dem Spielstand
                     // wiederhergestellt wird (dann keine Meldungen ausgeben)
    }

    Alle Texte stehen in !game/js/i18n/de.js und en.js unter
        achievement.<id>.title / .locked / .unlocked / .reward
    Platzhalter {goal} wird automatisch mit dem Ziel aus getProgress() gefüllt.
========================= */

// Solange ein Erfolg nicht freigeschaltet ist, wird die Belohnung nicht verraten ("???")
const ACHIEVEMENT_HIDDEN_REWARD_KEY = "achievement.hiddenReward";

const ACHIEVEMENT_POINT_REWARDS = {
    firstSteps: 5, goldenAge: 50, knowledgeIsPower: 10, smallCollector: 5,
    buildColony: 10, mushroomFarmTen: 5, mushroomFarmTwentyFive: 5,
    mushroomFarmFifty: 10, mushroomFarmHundred: 15, mushroomFarmTwoFifty: 20,
    purchasedAnts1: 0, purchasedAnts10: 0, purchasedAnts50: 5,
    purchasedAnts100: 10, purchasedAnts250: 10, purchasedAnts500: 15,
    purchasedAnts1000: 20, smallColony: 5, queenColonyTwentyFive: 5,
    queenColonyHundred: 10, collector10: 0, collector25: 5,
    collector50: 5, collector100: 10, collector250: 15,
    expeditionVeteran: 0, speedExpeditions: 5, expeditionCommander: 10,
    criticalMastery: 10, foundTenAnts: 5, expeditionMisfortune: 5,
    expeditionMisfortuneMaster: 10, expeditionMisfortuneLegend: 15
};

const ACHIEVEMENTS = [];

function registerAchievement(definition)
{
    if (!Number.isFinite(definition.epReward))
    {
        definition.epReward = ACHIEVEMENT_POINT_REWARDS[definition.id] || 0;
    }

    ACHIEVEMENTS.push(definition);
    ACHIEVEMENTS.sort((a, b) => a.order - b.order);
}

function getAchievementOrder(id)
{
    return ACHIEVEMENTS.findIndex(definition => definition.id === id);
}
