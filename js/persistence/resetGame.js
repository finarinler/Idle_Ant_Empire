/* =========================
    Spielstand löschen
    Die Spracheinstellung bleibt bewusst erhalten (eigener Speicherschlüssel).
========================= */

function resetGame()
{
    if (!confirm(I18N.t("confirm.resetGame")))
    {
        return;
    }

    // Verhindert, dass der Autosave den Spielstand vor dem Neuladen wieder schreibt
    GameState.ui.isResetting = true;

    localStorage.removeItem(CORE_CONFIG.SAVE_KEY);
    localStorage.removeItem(SAVE_BACKUP_KEY_V1);
    localStorage.removeItem(SAVE_BACKUP_KEY_CORRUPT);
    location.reload();
}
