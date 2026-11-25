/* =========================
    Musiksteuerung
    Es gibt genau EIN Audio-Element, EINEN Pausen-Timer und damit nur eine Wiedergabeschleife:

        theme1.mp3 (vollständig) -> 12 s Pause -> theme2.mp3 (vollständig) -> 12 s Pause -> theme1.mp3 ...

    Einstellungen (unverändertes Format, localStorage "idleAntEmpireMusicSettings"):
        { isEnabled: boolean, volume: 0..1 }   Standard: aktiviert, 25 % Lautstärke

    Wiedergabezustand (phase):
        stopped  nichts läuft (Musik aus oder noch nicht gestartet)
        loading  play() wurde aufgerufen, die Wiedergabe beginnt gleich
        playing  ein Titel läuft
        gap      12-Sekunden-Pause zwischen zwei Titeln
        paused   vom Benutzer pausiert (nur für diese Sitzung, wird nicht gespeichert)
        blocked  der Browser hat die automatische Wiedergabe abgelehnt -> Klick auf Play nötig
        error    die Musikdatei konnte nicht geladen werden

    Der Autostart ist ein Best-Effort-Versuch: Lehnt der Browser ihn ab, läuft das Spiel
    normal weiter. Es werden keine Klicks simuliert; gestartet wird nur durch eine echte
    Benutzeraktion (Play-Button im Options-Menü oder die erste echte Eingabe im Spiel).
========================= */

window.MusicController = window.MusicController || (() =>
{
    const THEMES = [
        "!game/assets/music/theme/theme1.mp3",
        "!game/assets/music/theme/theme2.mp3"
    ];

    const PAUSE_BETWEEN_THEMES = 12000;
    const DEFAULT_VOLUME = 0.25;
    const SETTINGS_KEY = "idleAntEmpireMusicSettings";

    // IDs der Bedienelemente im Options-Menü (game.html)
    const CONTROL_IDS = {
        toggle: "music-toggle",
        playPause: "music-play-pause",
        playIcon: "music-play-icon",
        playLabel: "music-play-label",
        volume: "music-volume",
        volumeValue: "music-volume-value",
        status: "music-status"
    };

    // Dauerhaft gespeicherte Einstellungen
    let isEnabled = true;
    let volume = DEFAULT_VOLUME;

    // Laufzeitzustand
    let audio = null;
    let themeIndex = 0;
    let loadedThemeIndex = -1;
    let phase = "stopped";
    let pausedDuringGap = false;
    let gapTimer = null;
    let gapEndsAt = 0;
    let gapRemaining = 0;
    let playToken = 0;
    let expectedPauseEvents = 0;
    let controlsInitialized = false;
    let interactionListenersAttached = false;

    const controls = {};
    const changeListeners = [];

    /* =========================
        Einstellungen
    ========================= */

    function loadSettings()
    {
        try
        {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));

            if (settings && typeof settings === "object")
            {
                // Nur ein ausdrückliches "false" schaltet die Musik dauerhaft aus
                isEnabled = settings.isEnabled !== false;

                const savedVolume = Number(settings.volume ?? DEFAULT_VOLUME);

                volume = Number.isFinite(savedVolume)
                    ? Math.max(0, Math.min(1, savedVolume))
                    : DEFAULT_VOLUME;
            }
        }
        catch (error)
        {
            console.warn("Musikeinstellungen konnten nicht geladen werden.", error);
        }
    }

    function saveSettings()
    {
        try
        {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify({
                isEnabled,
                volume
            }));
        }
        catch (error)
        {
            console.warn("Musikeinstellungen konnten nicht gespeichert werden.", error);
        }
    }

    /* =========================
        Zustand
    ========================= */

    function setPhase(newPhase)
    {
        phase = newPhase;
        notifyChange();
    }

    function notifyChange()
    {
        renderControls();

        changeListeners.slice().forEach(listener =>
        {
            try
            {
                listener(getStatus());
            }
            catch (error)
            {
                console.error("Fehler in Musik-Listener:", error);
            }
        });
    }

    function getStatus()
    {
        return {
            isEnabled,
            volume,
            themeIndex,
            isPlaying: phase === "playing",
            phase,
            isPaused: phase === "paused",
            autoplayBlocked: phase === "blocked",
            currentTheme: THEMES[themeIndex],
            gapRemainingMs: phase === "gap" ? Math.max(0, gapEndsAt - Date.now()) : 0
        };
    }

    function onChange(listener)
    {
        if (typeof listener === "function")
        {
            changeListeners.push(listener);
        }
    }

    /* =========================
        Audio-Element (nur einmal)
    ========================= */

    function initialize()
    {
        if (audio) return;

        try
        {
            audio = new Audio();
        }
        catch (error)
        {
            console.warn("Audio wird von diesem Browser nicht unterstützt.", error);
            return;
        }

        audio.preload = "auto";
        audio.loop = false;
        audio.volume = volume;

        audio.addEventListener("ended", handleTrackEnded);

        audio.addEventListener("playing", () =>
        {
            if (isEnabled && (phase === "loading" || phase === "blocked" || phase === "paused") && !pausedDuringGap)
            {
                setPhase("playing");
            }
        });

        audio.addEventListener("pause", () =>
        {
            if (expectedPauseEvents > 0)
            {
                expectedPauseEvents--;
                return;
            }

            // Der Titel ist zu Ende (das "ended"-Ereignis folgt direkt)
            if (audio.ended) return;

            // Der Browser oder das Betriebssystem hat angehalten (Medientaste, Unterbrechung ...)
            if (isEnabled && phase === "playing")
            {
                pausedDuringGap = false;
                setPhase("paused");
            }
        });

        audio.addEventListener("error", () =>
        {
            if (!audio.getAttribute("src") && !audio.src) return;

            console.error("Musikdatei konnte nicht geladen werden:", THEMES[themeIndex]);

            playToken++;
            clearGapTimer();
            setPhase("error");
        });
    }

    function pauseAudio()
    {
        if (audio && !audio.paused)
        {
            expectedPauseEvents++;
            audio.pause();
        }
    }

    /* =========================
        Wiedergabeschleife
    ========================= */

    function clearGapTimer()
    {
        if (gapTimer !== null)
        {
            clearTimeout(gapTimer);
            gapTimer = null;
        }
    }

    function startGap(duration)
    {
        clearGapTimer();

        gapEndsAt = Date.now() + duration;
        gapRemaining = duration;

        setPhase("gap");

        gapTimer = setTimeout(() =>
        {
            gapTimer = null;

            if (isEnabled && phase === "gap")
            {
                playCurrentTheme();
            }
        }, duration);
    }

    function handleTrackEnded()
    {
        if (!isEnabled || phase === "paused") return;

        themeIndex = (themeIndex + 1) % THEMES.length;

        startGap(PAUSE_BETWEEN_THEMES);
    }

    /**
     * Startet (oder setzt fort) den aktuellen Titel. Wird sowohl für den automatischen
     * Versuch als auch für echte Klicks verwendet; ein abgelehntes play() bricht nichts ab.
     */
    function playCurrentTheme()
    {
        initialize();

        if (!isEnabled || !audio) return;

        clearGapTimer();
        pausedDuringGap = false;
        expectedPauseEvents = 0;

        if (loadedThemeIndex !== themeIndex)
        {
            audio.src = THEMES[themeIndex];
            loadedThemeIndex = themeIndex;
        }

        const token = ++playToken;

        setPhase("loading");

        let attempt;

        try
        {
            attempt = audio.play();
        }
        catch (error)
        {
            handlePlayRejected(error, token);
            return;
        }

        if (attempt && typeof attempt.then === "function")
        {
            attempt.then(() =>
            {
                if (token === playToken && isEnabled && phase === "loading")
                {
                    setPhase("playing");
                }
            }).catch(error => handlePlayRejected(error, token));
        }
    }

    function handlePlayRejected(error, token)
    {
        // Veraltet: zwischenzeitlich wurde pausiert, deaktiviert oder neu gestartet
        if (token !== playToken || !isEnabled) return;

        const name = error && error.name;

        // Durch pause() oder einen neuen Ladevorgang unterbrochen: kein Fehler
        if (name === "AbortError") return;

        if (name === "NotSupportedError")
        {
            console.error("Musikdatei wird nicht unterstützt:", THEMES[themeIndex], error);
            setPhase("error");
            return;
        }

        console.warn(
            "Autostart wurde vom Browser blockiert. "
            + "Nach einer Benutzerinteraktion kann die Wiedergabe gestartet werden.",
            error
        );

        setPhase("blocked");
    }

    /* =========================
        Öffentliche Steuerung
    ========================= */

    /** Autostart-Versuch (Best Effort). Mehrfachaufrufe starten nichts doppelt. */
    function start()
    {
        initialize();

        if (!isEnabled || !audio) return;

        if (phase === "stopped" || phase === "blocked")
        {
            playCurrentTheme();
        }
    }

    function pause()
    {
        if (!isEnabled) return;

        if (phase === "playing" || phase === "loading")
        {
            playToken++;
            pausedDuringGap = false;
            pauseAudio();
            setPhase("paused");
        }
        else if (phase === "gap")
        {
            gapRemaining = Math.max(0, gapEndsAt - Date.now());
            clearGapTimer();
            pausedDuringGap = true;
            setPhase("paused");
        }
    }

    function resume()
    {
        if (!isEnabled) return;

        if (phase === "paused")
        {
            if (pausedDuringGap && gapRemaining > 0)
            {
                pausedDuringGap = false;
                startGap(gapRemaining);
            }
            else
            {
                playCurrentTheme();
            }
        }
        else if (phase === "stopped" || phase === "blocked" || phase === "error")
        {
            playCurrentTheme();
        }
    }

    function togglePlayback()
    {
        if (!isEnabled) return;

        if (phase === "playing" || phase === "loading" || phase === "gap")
        {
            pause();
        }
        else
        {
            resume();
        }
    }

    function enable()
    {
        isEnabled = true;
        saveSettings();

        if (phase === "stopped" || phase === "blocked" || phase === "paused" || phase === "error")
        {
            phase = "stopped";
            pausedDuringGap = false;
            playCurrentTheme();
        }
        else
        {
            notifyChange();
        }
    }

    function disable()
    {
        isEnabled = false;
        saveSettings();

        playToken++;
        clearGapTimer();
        pausedDuringGap = false;

        if (audio)
        {
            pauseAudio();

            try
            {
                audio.currentTime = 0;
            }
            catch (error)
            {
                // Noch keine Metadaten geladen: nichts zurückzusetzen
            }
        }

        setPhase("stopped");
    }

    function setVolume(value)
    {
        const newVolume = Number(value);

        if (!Number.isFinite(newVolume)) return;

        volume = Math.max(0, Math.min(1, newVolume));

        initialize();

        if (audio)
        {
            audio.volume = volume;
        }

        saveSettings();
        notifyChange();
    }

    /* =========================
        Erste echte Eingabe
        Hat der Browser den Autostart abgelehnt, genügt die erste echte Eingabe im Spiel,
        um die Musik zu starten. Eingaben im Options-Menü zählen nicht: dort entscheidet
        der Benutzer selbst über Play, Pause und Ein/Aus.
    ========================= */

    function handleFirstInteraction(event)
    {
        const target = event && event.target;

        if (target && typeof target.closest === "function"
            && target.closest("#options-menu, #options-toggle-btn"))
        {
            return;
        }

        if (isEnabled && phase === "blocked")
        {
            playCurrentTheme();
        }

        if (phase === "playing" || phase === "loading")
        {
            removeInteractionListeners();
        }
    }

    function attachInteractionListeners()
    {
        if (interactionListenersAttached) return;

        interactionListenersAttached = true;

        document.addEventListener("pointerdown", handleFirstInteraction, true);
        document.addEventListener("keydown", handleFirstInteraction, true);
    }

    function removeInteractionListeners()
    {
        if (!interactionListenersAttached) return;

        interactionListenersAttached = false;

        document.removeEventListener("pointerdown", handleFirstInteraction, true);
        document.removeEventListener("keydown", handleFirstInteraction, true);
    }

    /* =========================
        Bedienelemente im Options-Menü
    ========================= */

    function translate(key, params)
    {
        return typeof I18N !== "undefined" ? I18N.tPlain(key, params) : key;
    }

    function getStatusKey()
    {
        if (!isEnabled) return "music.status.off";

        switch (phase)
        {
            case "loading": return "music.status.loading";
            case "playing": return "music.status.playing";
            case "gap": return "music.status.gap";
            case "paused": return "music.status.paused";
            case "blocked": return "music.status.blocked";
            case "error": return "music.status.error";
            default: return "music.status.ready";
        }
    }

    function renderControls()
    {
        if (!controlsInitialized) return;

        const percent = Math.round(volume * 100);
        const percentText = translate("music.volumeValue", { value: String(percent) });
        const showsPause = isEnabled && (phase === "playing" || phase === "loading" || phase === "gap");

        controls.toggle.textContent = translate(isEnabled ? "music.enabled" : "music.disabled");
        controls.toggle.classList.toggle("is-enabled", isEnabled);
        controls.toggle.classList.toggle("is-disabled", !isEnabled);
        controls.toggle.setAttribute("aria-pressed", String(isEnabled));

        if (String(controls.volume.value) !== String(percent))
        {
            controls.volume.value = String(percent);
        }

        controls.volume.setAttribute("aria-valuetext", percentText);
        controls.volumeValue.textContent = percentText;

        const label = translate(showsPause ? "music.pause" : "music.play");

        controls.playLabel.textContent = label;
        controls.playIcon.textContent = showsPause ? "❚❚" : "▶";
        controls.playPause.setAttribute("aria-label", label);
        controls.playPause.dataset.state = showsPause ? "playing" : "stopped";
        controls.playPause.disabled = !isEnabled;

        // Nummer des Titels (1-basiert); bei einer Pause zeigt sie den nächsten Titel
        controls.status.textContent = translate(getStatusKey());
        controls.status.dataset.phase = isEnabled ? phase : "off";
    }

    function initializeControls()
    {
        if (controlsInitialized) return;

        Object.keys(CONTROL_IDS).forEach(key =>
        {
            controls[key] = document.getElementById(CONTROL_IDS[key]);
        });

        if (Object.values(controls).some(element => !element))
        {
            console.warn("Musikbedienelemente wurden nicht gefunden.");
            return;
        }

        controls.toggle.addEventListener("click", () =>
        {
            if (isEnabled) disable();
            else enable();
        });

        controls.playPause.addEventListener("click", togglePlayback);

        controls.volume.addEventListener("input", () =>
        {
            setVolume(Number(controls.volume.value) / 100);
        });

        // Sprachwechsel: nur die Texte neu zeichnen, die Wiedergabe bleibt unberührt
        if (typeof I18N !== "undefined")
        {
            I18N.onChange(renderControls);
        }

        controlsInitialized = true;

        renderControls();
    }

    /* =========================
        Initialisierung
        Das Skript wird bereits im <head> geladen: Der Autostart-Versuch läuft damit
        während des Ladebildschirms und unabhängig vom Modul-Loader.
    ========================= */

    loadSettings();
    initialize();

    if (isEnabled)
    {
        attachInteractionListeners();
        start();
    }

    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", initializeControls, { once: true });
    }
    else
    {
        initializeControls();
    }

    return {
        initControls: initializeControls,
        start,
        enable,
        disable,
        pause,
        resume,
        togglePlayback,
        setVolume,
        getStatus,
        onChange,
        THEMES,
        PAUSE_BETWEEN_THEMES
    };
})();
