/* =========================
    Spielstand löschen
========================= */

function resetGame()
{
    if (!confirm("Möchtest du wirklich den gesamten Spielstand löschen? Dies kann nicht rückgängig gemacht werden!"))
    {
        return;
    }

    // Verhindert, dass der Autosave den Spielstand vor dem Neuladen wieder schreibt
    GameState.ui.isResetting = true;

    localStorage.removeItem(CORE_CONFIG.SAVE_KEY);
    location.reload();
}
