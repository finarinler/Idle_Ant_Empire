/* =========================
    Ressourcen-Definitionen
    Jede Ressource besitzt eine AUSDRÜCKLICH festgelegte Grundkapazität.
    Neue Ressourcen dürfen nur mit eigener Grundkapazität ergänzt werden
    (keine Übernahme des Werts einer anderen Ressource).
========================= */

const RESOURCE_DEFINITIONS = {
    food:   { id: "food",   baseCapacity: 1500 },
    larvae: { id: "larvae", baseCapacity: 150 }
};

const RESOURCE_IDS = Object.keys(RESOURCE_DEFINITIONS);
