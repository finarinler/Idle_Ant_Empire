/* =========================
    Kategorien ein-/ausklappen und freischalten
========================= */

function toggleCategory(categoryId)
{
    const wrapper = document.getElementById(`cat-${categoryId}`);

    if (wrapper)
    {
        wrapper.classList.toggle("collapsed");
    }
}

// silent = true beim Wiederherstellen eines Spielstands (keine Meldung ins Logbuch)

function unlockStructuresUI(silent = false)
{
    if (!DOM.catBasisStructures)
    {
        return;
    }

    DOM.catBasisStructures.style.display = "block";
    DOM.catBasisStructures.classList.remove("locked");

    if (!silent)
    {
        updateStatus("status.structuresUnlocked", "success");
    }
}

function unlockEliteUI(silent = false)
{
    if (!DOM.catEliteUnits)
    {
        return;
    }

    DOM.catEliteUnits.style.display = "block";
    DOM.catEliteUnits.classList.remove("locked");

    if (!silent)
    {
        updateStatus("status.eliteUnlocked", "success");
    }
}

function unlockScoutUI(silent = false)
{
    if (!DOM.cardScout)
    {
        return;
    }

    // "" entfernt das inline display:none, die Karte nutzt wieder ihr CSS (flex)
    DOM.cardScout.style.display = "";
    DOM.cardScout.classList.remove("locked");
    DOM.cardScout.classList.add("unlocked");

    if (!silent)
    {
        updateStatus("status.scout.unlocked", "success");
    }
}
