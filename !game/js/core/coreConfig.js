/**
 * =========================
 * Idle Ant Empire
 * Zentrale Versions- und Kernkonfiguration
 * =========================
 */

/* =========================
    Version  (EINZIGE Stelle, an der die Versionsnummer steht)
========================= */
const GAME_VERSION = "alpha-v0.00.007c";

/* =========================
    Spielstand-Reset-Marker
    Ein Spielstand wird nur dann komplett gelöscht, wenn sein gespeicherter
    Marker NICHT mit diesem Wert übereinstimmt (einmaliger Neustart).
    Dieser Wert bleibt bei späteren Updates UNVERÄNDERT, damit vorhandene
    Spielstände erhalten bleiben. Er wird nur geändert, wenn bewusst wieder
    ein vollständiger Reset gewünscht ist.
========================= */
const RESET_EPOCH = "reset-alpha-v0.00.007a";

/* =========================
    Core Configuration
========================= */
const CORE_CONFIG = {
    TICK_INTERVAL_MS: 100,
    SAVE_INTERVAL_MS: 60 * 1000,
    SPECIAL_SAVE_MIN_SECONDS: 60,
    MAX_OFFLINE_TIME_MS: 2 * 60 * 60 * 1000,
    DEATH_TIMER_SECONDS: 10,
    EXPEDITION_DURATION_MS: 10000,
    EXPEDITION_DURATION_FAST_MS: 5000,
    SCOUT_REST_MS: 5000,
    MAX_LOG_ENTRIES: 50,
    STATUS_RESET_MS: 10000,
    SAVE_KEY: "ant_empire_save"
};
