/* =========================
    Erfolge: Karte in der Erfolgsliste zeichnen
========================= */

function renderAchievementCard(id, title, desc, rewardText, isUnlocked = false, progressPercent = 0, progressText = "")
{
    if (!DOM.achievementList)
    {
        return;
    }

    if (DOM.noAchievementsMsg)
    {
        DOM.noAchievementsMsg.remove();
        DOM.noAchievementsMsg = null;
    }

    let card = document.getElementById(`ach-${id}`);

    if (!card)
    {
        card = document.createElement("div");
        card.id = `ach-${id}`;
        insertAchievementCard(card, id);
    }

    card.className = `achievement-card ${isUnlocked ? "unlocked" : "locked"}`;

    if (isUnlocked)
    {
        card.style.removeProperty("--ach-progress");
    }
    else
    {
        card.style.setProperty("--ach-progress", `${progressPercent}%`);
    }

    // Inhalt nur neu zeichnen, wenn er sich geändert hat (die Prüfung läuft jeden Tick)
    const signature = [title, desc, rewardText, isUnlocked, progressText].join("|");

    if (card.dataset.signature !== signature)
    {
        card.dataset.signature = signature;
        card.innerHTML = `
            <div class="ach-title">
                <span>${title}</span>
                <span class="ach-progress-text">${isUnlocked ? "Erreicht" : progressText}</span>
            </div>
            <p class="ach-desc">${desc}</p>
            <p class="ach-reward">${rewardText}</p>
        `;
    }
}

// Sortiert die neue Karte anhand der Reihenfolge in der Registry ein
function insertAchievementCard(card, id)
{
    const targetIndex = getAchievementOrder(id);

    for (const other of DOM.achievementList.children)
    {
        const otherId = other.id.replace("ach-", "");

        if (getAchievementOrder(otherId) > targetIndex)
        {
            DOM.achievementList.insertBefore(card, other);
            return;
        }
    }

    DOM.achievementList.appendChild(card);
}
