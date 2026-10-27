/* =========================
   Erfolge: Karten und einklappbare Kategorien
========================= */

const ACHIEVEMENT_CATEGORY_ORDER = [
    { id: "basic", label: "Basis", icon: "✦" },
    { id: "collect", label: "Sammeln", icon: "📦" },
    { id: "build", label: "Bauen", icon: "🏗" },
    { id: "expedition", label: "Expeditionen", icon: "🧭" },
    { id: "research", label: "Forschung", icon: "⚗" },
    { id: "military", label: "Militär", icon: "⚔" },
    { id: "other", label: "Weitere Erfolge", icon: "🏆" }
];

function getAchievementDefinition(id) {
    return ACHIEVEMENTS.find(item => item.id === id);
}

function getAchievementCategory(id) {
    const definition = getAchievementDefinition(id);
    return definition && definition.category ? definition.category : "other";
}

function getAchievementCategoryContainer(categoryId) {
    if (!DOM.achievementList) return null;
    let group = DOM.achievementList.querySelector(`[data-achievement-category="${categoryId}"]`);
    if (group) return group.querySelector(".achievement-category-cards");

    const category = ACHIEVEMENT_CATEGORY_ORDER.find(item => item.id === categoryId)
        || ACHIEVEMENT_CATEGORY_ORDER[ACHIEVEMENT_CATEGORY_ORDER.length - 1];
    group = document.createElement("section");
    group.className = "achievement-category";
    group.dataset.achievementCategory = category.id;

    const heading = document.createElement("button");
    heading.type = "button";
    heading.className = "achievement-category-toggle";
    heading.setAttribute("aria-expanded", "true");
    heading.innerHTML = `<span class="achievement-category-icon" aria-hidden="true">${category.icon}</span>
        <span class="achievement-category-name" data-i18n="achievements.cat.${category.id}">${I18N.tPlain(`achievements.cat.${category.id}`)}</span>
        <span class="achievement-category-count">0 / 0</span>
        <span class="achievement-category-chevron" aria-hidden="true">⌄</span>`;

    const cards = document.createElement("div");
    cards.className = "achievement-category-cards";
    heading.addEventListener("click", () => {
        const expanded = heading.getAttribute("aria-expanded") === "true";
        heading.setAttribute("aria-expanded", String(!expanded));
        cards.hidden = expanded;
        group.classList.toggle("is-collapsed", expanded);
    });
    group.append(heading, cards);

    const order = ACHIEVEMENT_CATEGORY_ORDER.findIndex(item => item.id === category.id);
    const existingGroups = [...DOM.achievementList.querySelectorAll(":scope > .achievement-category")];
    const before = existingGroups.find(item => {
        const idx = ACHIEVEMENT_CATEGORY_ORDER.findIndex(cat => cat.id === item.dataset.achievementCategory);
        return idx > order;
    });
    if (before) DOM.achievementList.insertBefore(group, before);
    else DOM.achievementList.appendChild(group);
    return cards;
}

function refreshAchievementCategoryCounts() {
    if (!DOM.achievementList) return;
    DOM.achievementList.querySelectorAll(".achievement-category").forEach(group => {
        const cards = [...group.querySelectorAll(".achievement-card")];
        const unlocked = cards.filter(card => card.classList.contains("unlocked")).length;
        const count = group.querySelector(".achievement-category-count");
        if (count) count.textContent = `${unlocked} / ${cards.length}`;
    });
}

/**
 * @param {string} id
 * @param {{title:string, desc:string, rewardText:string, progressText:string}} content
 * @param {boolean} isUnlocked
 * @param {number} progressPercent
 */
function renderAchievementCard(id, content, isUnlocked = false, progressPercent = 0) {
    if (!DOM.achievementList) return;

    if (DOM.noAchievementsMsg) {
        DOM.noAchievementsMsg.remove();
        DOM.noAchievementsMsg = null;
    }

    const categoryId = getAchievementCategory(id);
    const categoryCards = getAchievementCategoryContainer(categoryId);
    if (!categoryCards) return;

    let card = document.getElementById(`ach-${id}`);
    if (!card) {
        card = document.createElement("article");
        card.id = `ach-${id}`;
        card.dataset.achievementId = id;
        card.className = "achievement-card";
    }

    // Ein bestehender Erfolg muss immer in seiner aktuell zugewiesenen Kategorie liegen.
    // Das ist wichtig, wenn eine Kategorie geändert wurde (z. B. Wissen ist Macht -> Basis).
    if (card.parentElement !== categoryCards) {
        categoryCards.appendChild(card);
    }

    card.className = `achievement-card ${isUnlocked ? "unlocked" : "locked"}`;
    if (isUnlocked) card.style.removeProperty("--ach-progress");
    else card.style.setProperty("--ach-progress", `${progressPercent}%`);

    const progressText = isUnlocked ? I18N.t("achievement.reached") : content.progressText;
    const signature = [content.title, content.desc, content.rewardText, isUnlocked, progressText].join("|");
    if (card.dataset.signature !== signature) {
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
    refreshAchievementCategoryCounts();
}
