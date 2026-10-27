/* Idle Ant Empire – zentraler Wartungsstatus für GitHub Pages

   STATE:
   OFF         = normaler Betrieb
   COUNTDOWN   = Startseite/neue Spielaufrufe gesperrt; laufende Spiele zählen herunter
   MAINTENANCE = Wartungsseite für alle

   Countdown starten: STATE auf "COUNTDOWN" setzen und END_AT auf einen UTC-Zeitpunkt
   genau 5 Minuten nach dem geplanten Commit setzen, z. B. "2026-10-27T21:35:00Z".
   Nach diesem festen Zeitpunkt wechseln alle Besucher automatisch in die Wartung.
   Abbrechen: STATE wieder auf "OFF" setzen. Dauerhafte Wartung: "MAINTENANCE".

   Der alte Schalter bleibt als Rückwärtskompatibilität erhalten.
*/
window.IDLE_ANT_MAINTENANCE_STATE = "COUNTDOWN";
window.IDLE_ANT_MAINTENANCE_END_AT = "2026-10-27T22:32:00Z";
window.IDLE_ANT_MAINTENANCE_MODE = false; // Legacy: true = sofortige Wartung
