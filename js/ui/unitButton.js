/* =========================
    Kauf-Button einer Einheit: Text + Sperrzustand
========================= */

/**
 * @param {HTMLButtonElement} button
 * @param {{unlocked:boolean, maxReached:boolean, canAfford:boolean, maxText?:string}} state
 */
function setTrainButtonState(button, state)
{
    if (!button)
    {
        return;
    }

    button.disabled = !state.unlocked || state.maxReached || !state.canAfford;

    if (!state.unlocked)
    {
        button.textContent = "Gesperrt";
    }
    else if (state.maxReached)
    {
        button.textContent = state.maxText || "Maximum erreicht";
    }
    else if (!state.canAfford)
    {
        button.textContent = "Ressourcen fehlen";
    }
    else
    {
        button.textContent = "Ausbilden";
    }
}
