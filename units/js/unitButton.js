/* =========================
    Kauf-Button einer Einheit: Text + Sperrzustand
========================= */

/**
 * @param {HTMLButtonElement} button
 * @param {{unlocked:boolean, maxReached:boolean, canAfford:boolean}} state
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
        I18N.setText(button, "button.locked");
    }
    else if (state.maxReached)
    {
        I18N.setText(button, "button.maxReached");
    }
    else if (!state.canAfford)
    {
        I18N.setText(button, "button.missingResources");
    }
    else
    {
        I18N.setText(button, "button.train");
    }
}
