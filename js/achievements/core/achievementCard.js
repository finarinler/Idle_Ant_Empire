/* =========================
    Erfolge: Karte in der Erfolgsliste zeichnen
    Die Karte wird per DOM-API (textContent) aufgebaut und bei Sprachwechsel neu gezeichnet.
========================= */

/**
 * @param {string} id               Erfolg-ID
 * @param {Object} content          { title, desc, rewardText, progressText } (bereits übersetzt)
 * @param {boolean} isUnlocked
 * @param {number} progressPercent
 */
function renderAchievementCard(id, content, isUnlocked = false, progressPercent = 0)
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
    const progressText = isUnlocked ? I18N.t("achievement.reached") : content.progressText;
    const signature = [content.title, content.desc, content.rewardText, isUnlocked, progressText].join("|");

    if (card.dataset.signature !== signature)
    {
        card.dataset.signature = signature;

        const titleRow = document.createElement("div");
        titleRow.className = "ach-title";

        const title = document.createElement("span");
        title.textContent = content.title;

        const progress = document.createElement("span");
        progress.className = "ach-progress-text";
        progress.textContent = progressText;

        titleRow.append(title, progress);

        const desc = document.createElement("p");
        desc.className = "ach-desc";
        desc.textContent = content.desc;

        const reward = document.createElement("p");
        reward.className = "ach-reward";
        reward.textContent = content.rewardText;

        card.replaceChildren(titleRow, desc, reward);
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
