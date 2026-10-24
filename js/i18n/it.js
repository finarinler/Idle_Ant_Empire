/* =========================
    Traduzioni: Italiano
    Le chiavi mancanti usano il tedesco come ripiego (vedi i18n.js). Mantieni lo stesso insieme di chiavi di de.js.
    Segnaposto: {name}   Abbreviazioni delle risorse: [[F]]   A capo: \n
========================= */

I18N.register("it", {

    /* ---------- Schermata di caricamento ---------- */
    "loading.subtitle": "Preparazione della tua colonia ...",
    "loading.initial": "Le formiche si stanno radunando ...",
    "loading.progressLabel": "Caricamento del gioco",
    "loading.gathering": "Radunamento delle tue formiche ...",
    "loading.modules": "Caricamento dei moduli di gioco ... ({current}/{total})",
    "loading.awakening": "La tua colonia si sta risvegliando ...",
    "loading.ready": "La tua colonia è pronta!",
    "loading.failedStatus": "Caricamento non riuscito. Controlla il messaggio di errore.",
    "loading.failedTitle": "Ops! Qualcosa è andato storto.",
    "loading.unknownError": "Errore di caricamento sconosciuto.",
    "loading.scriptError": "Errore durante il caricamento di: {path}",

    /* ---------- Risorse ---------- */
    "resource.food": "Cibo",
    "resource.larvae": "Larve",
    "resource.ant": "Formica",
    "resource.queen": "Regina",
    "resource.soldier": "Soldato d’élite",

    /* ---------- Interfaccia generale ---------- */
    "ui.total": "Totale:",
    "ui.bought": "Acquistate:",
    "ui.count": "Quantità:",
    "ui.language": "Lingua",
    "ui.legend": "Legenda",
    "ui.log": "Diario",
    "ui.achievements": "Obiettivi",
    "ui.achievementsLocked": "Obiettivi ancora bloccati",
    "status.label": "Stato:",
    "status.init": "Inizializzazione...",
    "status.default": "La tua colonia è pronta e in attesa",

    "button.build": "Costruisci",
    "button.built": "Costruita",
    "button.locked": "Bloccato",
    "button.maxReached": "Massimo raggiunto",
    "button.missingResources": "Risorse insufficienti",
    "button.train": "Addestra",

    /* ---------- Categorie ---------- */
    "category.basisUnits": "Unità di base",
    "category.eliteUnits": "Unità d’élite",
    "category.basisStructures": "Strutture di base",

    /* ---------- Spedizione ---------- */
    "expedition.start": "Parti in spedizione ({seconds} s)",
    "expedition.running": "In spedizione",
    "expedition.scoutLockedTitle": "L’esploratrice conduce le spedizioni automaticamente.",

    /* ---------- Unità ---------- */
    "unit.ant.name": "Formica",
    "unit.ant.desc": "Raccoglie {production} [[F]] /s\nRichiede {consumption} [[F]] /s",
    "unit.ant.buy": "Compra formica",
    "unit.queen.name": "Regina",
    "unit.queen.desc": "Produce {production} [[L]] /s\nRichiede {consumption} [[F]] /s",
    "unit.queen.buy": "Compra regina",
    "unit.scout.name": "Esploratrice",
    "unit.scout.desc": "Automatizza le spedizioni.\nMa ha bisogno di pause per riposare",
    "unit.storageGuardian.name": "Guardiana delle scorte",
    "unit.storageGuardian.desc": "Raddoppia la scorta di cibo.\nConsuma {upkeep} [[F]]/s.",
    "unit.grandNurse.name": "Grande balia",
    "unit.grandNurse.desc": "Raddoppia la scorta di larve.\nConsuma {upkeep} [[F]]/s.",
    "unit.broodExpert.name": "Esperta della covata",
    "unit.broodExpert.desc": "Alleva nuove formiche dalle larve.\nOgni {interval} secondi: +{ants} [[A]], -{larvae} [[L]].",
    "unit.soldier.name": "Soldato d’élite",
    "unit.soldier.desc": "Mette in sicurezza il territorio durante le spedizioni.\nNecessario per l’espansione.",

    /* ---------- Strutture ---------- */
    "structure.storage.name": "Dispensa",
    "structure.storage.desc": "Perfeziona l’immagazzinamento\nAumenta il limite di cibo",
    "structure.nursery.name": "Camera della covata",
    "structure.nursery.desc": "Perfeziona l’immagazzinamento\nAumenta il limite di larve",
    "structure.royalChamber.name": "Camera reale",
    "structure.royalChamber.desc": "Centro del potere.\nProduce regine",

    /* ---------- Pannelli ---------- */
    "panel.achievements.title": "Obiettivi",
    "panel.achievements.empty": "Nessun obiettivo sbloccato finora.",
    "panel.legend.title": "Legenda",
    "panel.log.title": "Diario",
    "log.clear": "Svuota diario",
    "log.resetGame": "Elimina salvataggio",
    "log.type.status": "Stato",
    "log.type.success": "Scoperta della spedizione",
    "log.type.achievement": "Obiettivo raggiunto",
    "log.type.warning": "Avviso",
    "log.type.system": "Sistema",

    /* ---------- Obiettivi: generale ---------- */
    "achievement.reached": "Raggiunto",
    "achievement.hiddenReward": "Ricompensa: ???",
    "status.achievementUnlocked": "Obiettivo: {title}",
    "log.achievementUnlocked": "Obiettivo sbloccato: {title}",

    /* ---------- Messaggi ---------- */
    "status.production.queensStarved": "Produzione interrotta: cibo insufficiente per le regine!",
    "status.production.starving": "Grave carenza di cibo: la colonia ha fame!",
    "status.expeditionStarted": "La tua colonia è in spedizione",
    "status.expeditionLockedByScout": "Le spedizioni manuali sono bloccate: l’esploratrice le conduce automaticamente.",
    "status.expedition.failed": "Spedizione fallita: non è stato trovato nulla.",
    "status.expedition.criticalSuccess": "Spedizione di grande successo: trovate {amount} unità di cibo.",
    "status.expedition.success": "Spedizione riuscita: trovate {amount} unità di cibo.",
    "status.ant.foundCritical": "Successo critico! Una formica si è unita alla tua colonia!",
    "status.ant.foundStray": "Una formica smarrita si è unita alla tua colonia!",
    "status.scout.needAchievement": "Sblocca prima l’obiettivo {achievement}.",
    "status.scout.alreadyTrained": "Hai già addestrato un’esploratrice.",
    "status.scout.cannotAfford": "Le risorse non bastano per l’esploratrice.",
    "status.scout.trained": "Esploratrice addestrata!",
    "status.scout.unlocked": "Esploratrice sbloccata!",
    "status.elite.requirements": "Prima ti servono una dispensa e una camera della covata.",
    "status.elite.maxReached": "Hai già addestrato il numero massimo di questa unità d’élite.",
    "status.elite.cannotAfford": "Le risorse non bastano per questa unità d’élite.",
    "status.broodExpert.trained": "Esperta della covata addestrata!",
    "status.grandNurse.trained": "Grande balia addestrata! La capacità della tua scorta di larve aumenta.",
    "status.storageGuardian.trained": "Guardiana delle scorte addestrata! La capacità della tua scorta di cibo aumenta.",
    "status.storage.built": "Dispensa costruita!",
    "status.storage.effect": "La capacità massima di cibo è aumentata notevolmente!",
    "status.nursery.built": "Camera della covata costruita!",
    "status.nursery.effect": "La capacità massima di larve è aumentata notevolmente!",
    "status.structuresUnlocked": "Strutture di base sbloccate!",
    "status.eliteUnlocked": "Unità speciali sbloccate!",
    "status.logCleared": "Diario svuotato.",
    "status.loadSuccess": "Salvataggio caricato correttamente.",
    "status.loadMigrated": "Un salvataggio precedente è stato convertito nel nuovo formato.",
    "status.loadFailed": "Impossibile caricare il salvataggio.",
    "error.invalidSaveFormat": "Formato di salvataggio non valido.",
    "confirm.resetGame": "Vuoi davvero eliminare l’intero salvataggio? L’operazione non può essere annullata!",

    /* ---------- Obiettivi: testi ---------- */
    "achievement.firstSteps.title": "Primi passi",
    "achievement.firstSteps.locked": "{goal} spedizioni completate",
    "achievement.firstSteps.unlocked": "{goal} spedizioni completate",
    "achievement.firstSteps.reward": "Ricompensa: menu degli obiettivi sbloccato",

    "achievement.smallCollector.title": "Piccolo raccoglitore",
    "achievement.smallCollector.locked": "{goal} unità di cibo raccolte",
    "achievement.smallCollector.unlocked": "{goal} unità di cibo raccolte",
    "achievement.smallCollector.reward": "Ricompensa: possibilità di trovare una formica smarrita durante le spedizioni",

    "achievement.smallColony.title": "Piccolo formicaio",
    "achievement.smallColony.locked": "{goal} regine acquistate",
    "achievement.smallColony.unlocked": "{goal} regine acquistate",
    "achievement.smallColony.reward": "Ricompensa: strutture di base sbloccate",

    "achievement.buildColony.title": "Costruzione della colonia",
    "achievement.buildColony.locked": "Dispensa e camera della covata costruite",
    "achievement.buildColony.unlocked": "Dispensa e camera della covata costruite",
    "achievement.buildColony.reward": "Ricompensa: unità speciali sbloccate",

    "achievement.knowledgeIsPower.title": "Sapere è potere",
    "achievement.knowledgeIsPower.locked": "Addestrare una guardiana delle scorte e una grande balia",
    "achievement.knowledgeIsPower.unlocked": "Una guardiana delle scorte e una grande balia addestrate",
    "achievement.knowledgeIsPower.reward": "Ricompensa: ricerca sbloccata",
    "achievement.knowledgeIsPower.progress": "{guardians}/1 guardiana · {nurses}/1 balia",

    "achievement.foundTenAnts.title": "Salvatore di formiche",
    "achievement.foundTenAnts.locked": "Trovare {goal} formiche smarrite durante le spedizioni",
    "achievement.foundTenAnts.unlocked": "Trovate {goal} formiche smarrite durante le spedizioni",
    "achievement.foundTenAnts.reward": "Ricompensa: probabilità di trovare formiche smarrite raddoppiata",

    "achievement.expeditionVeteran.title": "Veterano delle spedizioni",
    "achievement.expeditionVeteran.locked": "Completare {goal} spedizioni",
    "achievement.expeditionVeteran.unlocked": "Completate {goal} spedizioni",
    "achievement.expeditionVeteran.reward": "Ricompensa: probabilità di spedizioni di grande successo raddoppiata",

    "achievement.speedExpeditions.title": "Zampe veloci",
    "achievement.speedExpeditions.locked": "Completare {goal} spedizioni",
    "achievement.speedExpeditions.unlocked": "Completate {goal} spedizioni",
    "achievement.speedExpeditions.reward": "Ricompensa: durata delle spedizioni ridotta definitivamente a 5 secondi",

    "achievement.expeditionCommander.title": "Comando delle spedizioni",
    "achievement.expeditionCommander.locked": "Completare {goal} spedizioni",
    "achievement.expeditionCommander.unlocked": "Completate {goal} spedizioni",
    "achievement.expeditionCommander.reward": "Ricompensa: esploratrice sbloccata",

    "achievement.criticalMastery.title": "Maestro delle spedizioni",
    "achievement.criticalMastery.locked": "Completare {goal} spedizioni di grande successo",
    "achievement.criticalMastery.unlocked": "Completate {goal} spedizioni di grande successo",
    "achievement.criticalMastery.reward": "Ricompensa: le spedizioni di grande successo trovano sempre una formica e portano il 50 % di cibo in più",

    "achievement.goldenAge.title": "L’età dell’oro",
    "achievement.goldenAge.locked": "250 spedizioni di grande successo, 300 formiche trovate e 25 regine",
    "achievement.goldenAge.unlocked": "250 spedizioni di grande successo, 300 formiche trovate e 25 regine",
    "achievement.goldenAge.reward": "Ricompensa: le formiche normali non consumano più cibo",
    "achievement.goldenAge.progress": "{critical}/250 spedizioni di grande successo · {ants}/300 formiche trovate · {queens}/25 regine",

    "achievement.expeditionMisfortune.title": "Iellato",
    "achievement.expeditionMisfortune.locked": "Subire {goal} spedizioni fallite",
    "achievement.expeditionMisfortune.unlocked": "Subite {goal} spedizioni fallite",
    "achievement.expeditionMisfortune.reward": "Ricompensa: la probabilità di fallimento diminuisce del 50 %",

    "achievement.expeditionMisfortuneMaster.title": "Maestro della sfortuna",
    "achievement.expeditionMisfortuneMaster.locked": "Subire {goal} spedizioni fallite",
    "achievement.expeditionMisfortuneMaster.unlocked": "Subite {goal} spedizioni fallite",
    "achievement.expeditionMisfortuneMaster.reward": "Ricompensa: la probabilità di fallimento diminuisce ulteriormente",

    "achievement.expeditionMisfortuneLegend.title": "Leggenda della sfortuna",
    "achievement.expeditionMisfortuneLegend.locked": "Subire {goal} spedizioni fallite",
    "achievement.expeditionMisfortuneLegend.unlocked": "Subite {goal} spedizioni fallite",
    "achievement.expeditionMisfortuneLegend.reward": "Ricompensa: le spedizioni non falliscono più e la probabilità di successi critici aumenta del 50 %",

    /* ---------- Pagina iniziale (index.html) ---------- */
    "landing.pageTitle": "Idle Ant Empire",
    "landing.metaDescription": "Costruisci il tuo regno di formiche, raccogli risorse e crea un potente impero di formiche in Idle Ant Empire.",
    "landing.brandLabel": "Idle Ant Empire – Home",
    "landing.navLabel": "Navigazione principale",
    "landing.languageMenuLabel": "Seleziona la lingua",
    "landing.languageActive": "Attiva",
    "landing.play": "Gioca",
    "landing.eyebrow": "La tua colonia. Il tuo impero.",
    "landing.heroDescription": "Inizia con una piccola colonia, raccogli risorse e crea un potente impero di formiche.",
    "landing.cta": "Costruisci la tua colonia",
    "landing.note": "Il tuo regno di formiche ti aspetta.",
    "landing.pillarsLabel": "Principio di gioco",
    "landing.pillar.build": "Costruire",
    "landing.pillar.improve": "Migliorare",
    "landing.pillar.discover": "Scoprire",

    /* ---------- Menu opzioni e lettore musicale ---------- */
    "options.button": "Opzioni",
    "research.button": "Ricerca",
    "options.title": "Opzioni",
    "options.close": "Chiudi",
    "options.language": "Lingua",
    "options.music": "Musica",
    "options.volume": "Volume",
    "music.enabled": "Musica attivata",
    "music.play": "Riproduci",
    "music.pause": "Pausa",
    "music.volumeValue": "{value}%",
    "music.status.off": "La musica è disattivata.",
    "music.status.ready": "Pronta.",
    "music.status.loading": "Caricamento della musica ...",
    "music.status.playing": "In riproduzione: brano {track}",
    "music.status.gap": "Pausa tra i brani – prossimo: brano {track}",
    "music.status.paused": "In pausa.",
    "music.status.blocked": "Il browser ha bloccato la riproduzione automatica. Fai clic su Riproduci per avviare la musica.",
    "music.status.error": "Impossibile caricare il file musicale."
});
