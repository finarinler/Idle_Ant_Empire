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

    Alle Texte stehen in js/i18n/de.js und en.js unter
        achievement.<id>.title / .locked / .unlocked / .reward
    Platzhalter {goal} wird automatisch mit dem Ziel aus getProgress() gefüllt.
========================= */

// Solange ein Erfolg nicht freigeschaltet ist, wird die Belohnung nicht verraten ("???")
const ACHIEVEMENT_HIDDEN_REWARD_KEY = "achievement.hiddenReward";

const ACHIEVEMENTS = [];

function registerAchievement(definition)
{
    ACHIEVEMENTS.push(definition);
    ACHIEVEMENTS.sort((a, b) => a.order - b.order);
}

function getAchievementOrder(id)
{
    return ACHIEVEMENTS.findIndex(definition => definition.id === id);
}
