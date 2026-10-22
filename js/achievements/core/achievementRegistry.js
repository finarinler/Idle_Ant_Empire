/* =========================
    Erfolge: Registry

    Aufbau einer Definition:
    {
        id:        Schlüssel in GameState.achievements,
        order:     Reihenfolge in der Erfolgsliste,
        title:     Titel,
        locked:    { description }           // Beschreibung solange gesperrt (Belohnung ist immer ???)
        unlocked:  { description, reward }   // Texte nach der Freischaltung
        getProgress: () => ({ current, goal, text? })
                     // freigeschaltet, sobald current >= goal
                     // text ist optional (Standard: "current/goal")
        onUnlock:  (restored) => {}          // optional
                     // restored = true, wenn der Erfolg nur aus dem Spielstand
                     // wiederhergestellt wird (dann keine Meldungen ausgeben)
    }
========================= */

// Solange ein Erfolg nicht freigeschaltet ist, wird die Belohnung nicht verraten
const ACHIEVEMENT_HIDDEN_REWARD = "Belohnung: ???";

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
