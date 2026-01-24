/* =========================
    Visual Effects
========================= */
function triggerFlash()
{
    if (!DOM.flashOverlay)
    {
        return;
    }
    DOM.flashOverlay.classList.remove(
        "animate-flash"
    );
    void DOM.flashOverlay.offsetWidth;
    DOM.flashOverlay.classList.add(
        "animate-flash"
    );
}

function triggerTrophy()
{
    if (!DOM.trophyOverlay)
    {
        return;
    }
    DOM.trophyOverlay.classList.remove(
        "animate-trophy"
    );
    void DOM.trophyOverlay.offsetWidth;
    DOM.trophyOverlay.classList.add(
        "animate-trophy"
    );
}

function createSingleConfetti()
{
    const colors = [
        "#c6a700",
        "#ffffff",
        "#b08d57"
    ];
    const confetti = document.createElement(
        "div"
    );
    confetti.classList.add(
        "confetti"
    );
    confetti.style.backgroundColor = colors[
        Math.floor(
            Math.random() * colors.length
        )
    ];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-10px";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(
        confetti
    );
    const animation = confetti.animate(
        [
            {
                transform: `translate3d(0, 0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate3d(${(Math.random() - 0.5) * 150}px, 100vh, 0) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ],
        {
            duration: Math.random() * 4000 + 3000,
            easing: "linear"
        }
    );
    animation.onfinish = () =>
    {
        confetti.remove();
    };
}

function triggerConfetti(durationMs = 2500)
{
    const interval = setInterval(
        () =>
        {
            createSingleConfetti();
        },
        10
    );
    setTimeout(
        () =>
        {
            clearInterval(
                interval
            );
        },
        durationMs
    );
}