/* =========================
    Footer-Panels (Logbuch, Legende, Erfolge)
    Es ist immer nur ein Panel gleichzeitig offen.
========================= */

function togglePanel(panel)
{
    if (!panel)
    {
        return;
    }

    [DOM.logContainer, DOM.legendContainer, DOM.achievementContainer].forEach(other =>
    {
        if (other && other !== panel)
        {
            other.classList.add("collapsed");
        }
    });

    panel.classList.toggle("collapsed");
}

function toggleLog()
{
    togglePanel(DOM.logContainer);
}

function toggleLegend()
{
    togglePanel(DOM.legendContainer);
}

function toggleAchievement()
{
    // Das Erfolgsmenü wird erst durch den Erfolg "Erste Schritte" zugänglich
    if (!GameState.achievements.firstSteps)
    {
        return;
    }

    togglePanel(DOM.achievementContainer);
}
