/* Idle Ant Empire – zentraler Wartungsstatus für GitHub Pages

   STATE:
   OFF         = normaler Betrieb
   COUNTDOWN   = neue Besucher gesperrt; bereits geöffnete Spiele bleiben bis END_AT spielbar,
                 zeigen Warnungen im Logbuch und wechseln bei END_AT zur Wartungsseite
   MAINTENANCE = Wartungsseite für alle ("ON" gilt als Alias)

   Countdown starten: STATE auf "COUNTDOWN" setzen und END_AT auf einen UTC-Zeitpunkt MIT
   Zeitzone setzen (Format 2026-10-27T21:40:00Z). GitHub Pages braucht nach dem Commit meist
   1–2 Minuten bis zur Auslieferung: END_AT entsprechend später wählen (z. B. Commit + 7 Min.),
   sonst sind die frühen Warnungen schon verstrichen (sie werden nicht rückwirkend ausgegeben).
   Fehlt END_AT oder ist es ungültig, wird NICHT weitergeleitet (Fehler in der Browser-Konsole).
   Abbrechen: STATE wieder auf "OFF" setzen. Dauerhafte Wartung: "MAINTENANCE".

   Der alte Boolean IDLE_ANT_MAINTENANCE_MODE gilt nur, solange STATE fehlt. Stehen beide
   widersprüchlich in der Datei, gewinnt STATE und die Konsole meldet den Widerspruch.
   Die Uhr wird, soweit der Server ein Date-Header liefert, am Server ausgerichtet; eine
   perfekte Synchronisierung aller Browser ist bei einer statischen Seite nicht möglich.
*/
window.IDLE_ANT_MAINTENANCE_STATE = "OFF";
window.IDLE_ANT_MAINTENANCE_END_AT = "2026-10-27T17:10:00Z"; // nur bei COUNTDOWN relevant (UTC)
window.IDLE_ANT_MAINTENANCE_MODE = false; // Legacy: true = sofortige Wartung (nur ohne STATE)
