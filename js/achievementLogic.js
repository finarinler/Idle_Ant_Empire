/* =========================
    Achievement Logic
========================= */

const ACHIEVEMENT_ORDER = [
    "firstSteps",
    "smallCollector",
    "smallColony",
    "buildColony"
];

function renderAchievementCard(
    id,
    title,
    desc,
    rewardText,
    isUnlocked = false,
    progressPercent = 0,
    progressText = ""
)
{
    if (DOM.noAchievementsMsg)
    {
        DOM.noAchievementsMsg.remove();

        DOM.noAchievementsMsg = null;
    }

    let existingCard = document.getElementById(
        `ach-${id}`
    );

    if (!existingCard)
    {
        existingCard = document.createElement(
            "div"
        );

        existingCard.id = `ach-${id}`;

        const cards = Array.from(
            DOM.achievementList.children
        );

        const targetIndex = ACHIEVEMENT_ORDER.indexOf(
            id
        );

        let placed = false;

        for (const card of cards)
        {
            const cardId = card.id.replace(
                'ach-',
                ''
            );

            if (ACHIEVEMENT_ORDER.indexOf(cardId) > targetIndex)
            {
                DOM.achievementList.insertBefore(
                    existingCard,
                    card
                );

                placed = true;

                break;
            }
        }

        if (!placed)
        {
            DOM.achievementList.appendChild(
                existingCard
            );
        }
    }

    existingCard.className = `achievement-card ${isUnlocked ? "unlocked" : "locked"}`;

    if (!isUnlocked)
    {
        existingCard.style.setProperty(
            '--ach-progress',
            `${progressPercent}%`
        );
    }
    else
    {
        existingCard.style.removeProperty(
            '--ach-progress'
        );
    }

    existingCard.innerHTML = `
        <div class="ach-title">
            <span>${title}</span>
            <span class="ach-progress-text">${isUnlocked ? "Erreicht" : progressText}</span>
        </div>
        <p class="ach-desc">${desc}</p>
        <p class="ach-reward">${rewardText}</p>
    `;
}

function unlockAchievement(
    id,
    title,
    desc,
    reward
)
{
    addLogEntry(
        `Erfolg freigeschaltet: ${title}`,
        "achievement"
    );

    updateStatus(
        `Erfolg: ${title}`,
        "success"
    );

    triggerTrophy();

    triggerFlash();

    triggerConfetti(
        1000
    );

    renderAchievementCard(
        id,
        title,
        desc,
        reward,
        true
    );
}

function checkAchievements()
{
    if (!GameState.achievements.firstSteps)
    {
        const goal = 5;

        const current = GameState.stats.expeditionsCount;

        const percent = Math.min(
            (current / goal) * 100,
            100
        );

        if (current >= goal)
        {
            GameState.achievements.firstSteps = true;

            if (DOM.achievementToggleBtn)
            {
                DOM.achievementToggleBtn.disabled = false;

                DOM.achievementToggleBtn.title = "Erfolge";
            }

            unlockAchievement(
                "firstSteps",
                "Erste Schritte",
                "5 Expeditionen abgeschlossen",
                "Belohnung: Erfolgsmenü freigeschaltet"
            );
        }
        else
        {
            renderAchievementCard(
                "firstSteps",
                "Erste Schritte",
                "5 Expeditionen abgeschlossen",
                "Belohnung: ???",
                false,
                percent,
                `${current}/${goal}`
            );
        }
    }

    if (!GameState.achievements.smallCollector)
    {
        const goal = 300;

        const current = GameState.resources.food;

        const percent = Math.min(
            (current / goal) * 100,
            100
        );

        if (current >= goal)
        {
            GameState.achievements.smallCollector = true;

            unlockAchievement(
                "smallCollector",
                "Kleiner Sammler",
                "300 Nahrung gesammelt",
                "Belohnung: Chance eine verirrte Ameise zu finden"
            );
        }
        else
        {
            renderAchievementCard(
                "smallCollector",
                "Kleiner Sammler",
                "300 Nahrung gesammelt",
                "Belohnung: ???",
                false,
                percent,
                `${Math.floor(current)}/${goal}`
            );
        }
    }

    if (!GameState.achievements.smallColony)
    {
        const goal = 10;

        const current = GameState.resources.queens;

        const percent = Math.min(
            (current / goal) * 100,
            100
        );

        if (current >= goal)
        {
            GameState.achievements.smallColony = true;

            unlockAchievement(
                "smallColony",
                "Kleiner Ameisenstaat",
                "10 Königinnen gekauft",
                "Belohnung: Basis-Strukturen freigeschaltet"
            );

            unlockStructuresUI();
        }
        else
        {
            renderAchievementCard(
                "smallColony",
                "Kleiner Ameisenstaat",
                "10 Königinnen gekauft",
                "Belohnung: ???",
                false,
                percent,
                `${current}/${goal}`
            );
        }
    }

    if (!GameState.achievements.buildColony)
    {
        if (
            GameState.structures.hasStorage &&
            GameState.structures.hasNursery
        )
        {
            GameState.achievements.buildColony = true;

            unlockAchievement(
                "buildColony",
                "Bau der Kolonie",
                "Vorratskammer und Brutkammer errichtet",
                "Belohnung: Spezialeinheiten freigeschaltet"
            );

            unlockEliteUI();
        }
        else
        {
            const storageDone = GameState.structures.hasStorage ? 1 : 0;

            const nurseryDone = GameState.structures.hasNursery ? 1 : 0;

            const percent = ((storageDone + nurseryDone) / 2) * 100;

            renderAchievementCard(
                "buildColony",
                "Bau der Kolonie",
                "Vorratskammer und Brutkammer errichtet",
                "Belohnung: ???",
                false,
                percent,
                `${storageDone + nurseryDone}/2`
            );
        }
    }
}