/* =========================
    Traductions : Français
    Les clés manquantes utilisent l’allemand comme repli (voir i18n.js). Garder le même ensemble de clés que de.js.
    Paramètres : {name}   Abréviations de ressources : [[F]]   Saut de ligne : \n
========================= */

I18N.register("fr", {

    /* ---------- Écran de chargement ---------- */
    "loading.subtitle": "Préparation de ta colonie ...",
    "loading.initial": "Rassemblement des fourmis ...",
    "loading.progressLabel": "Chargement du jeu",
    "loading.gathering": "Rassemblement de tes fourmis ...",
    "loading.modules": "Chargement des modules du jeu ... ({current}/{total})",
    "loading.awakening": "Ta colonie s’éveille ...",
    "loading.ready": "Ta colonie est prête\u00a0!",
    "loading.failedStatus": "Le chargement a échoué. Consulte le message d’erreur.",
    "loading.failedTitle": "Oups\u00a0! Une erreur s’est produite.",
    "loading.unknownError": "Erreur de chargement inconnue.",
    "loading.scriptError": "Échec du chargement de\u00a0: {path}",

    /* ---------- Ressources ---------- */
    "resource.food": "Nourriture",
    "resource.larvae": "Larves",
    "resource.ant": "Fourmi",
    "resource.queen": "Reine",
    "resource.soldier": "Soldat d’élite",

    /* ---------- Interface générale ---------- */
    "ui.total": "Total\u00a0:",
    "ui.bought": "Achetées\u00a0:",
    "ui.count": "Nombre\u00a0:",
    "ui.language": "Langue",
    "ui.legend": "Légende",
    "ui.log": "Journal",
    "ui.achievements": "Succès",
    "ui.achievementsLocked": "Succès pas encore débloqués",
    "status.label": "État\u00a0:",
    "status.init": "Initialisation ...",
    "status.default": "Ta colonie est prête et attend",

    "button.build": "Construire",
    "button.built": "Construit",
    "button.locked": "Verrouillé",
    "button.maxReached": "Maximum atteint",
    "button.missingResources": "Ressources insuffisantes",
    "button.train": "Entraîner",

    /* ---------- Catégories ---------- */
    "category.basisUnits": "Unités de base",
    "category.eliteUnits": "Unités d’élite",
    "category.basisStructures": "Structures de base",

    /* ---------- Expédition ---------- */
    "expedition.start": "Partir en expédition ({seconds} s)",
    "expedition.running": "En expédition",
    "expedition.scoutLockedTitle": "L’éclaireuse mène les expéditions automatiquement.",

    /* ---------- Unités ---------- */
    "unit.ant.name": "Fourmi",
    "unit.ant.desc": "Récolte {production} [[F]] /s\nConsomme {consumption} [[F]] /s",
    "unit.ant.buy": "Acheter une fourmi",
    "unit.queen.name": "Reine",
    "unit.queen.desc": "Produit {production} [[L]] /s\nConsomme {consumption} [[F]] /s",
    "unit.queen.buy": "Acheter une reine",
    "unit.scout.name": "Éclaireuse",
    "unit.scout.desc": "Automatise les expéditions.\nMais a besoin de pauses de repos",
    "unit.storageGuardian.name": "Gardienne des réserves",
    "unit.storageGuardian.desc": "Double le stock de nourriture.\nConsomme {upkeep} [[F]]/s.",
    "unit.grandNurse.name": "Grande nourrice",
    "unit.grandNurse.desc": "Double le stock de larves.\nConsomme {upkeep} [[F]]/s.",
    "unit.broodExpert.name": "Experte du couvain",
    "unit.broodExpert.desc": "Élève de nouvelles fourmis à partir des larves.\nToutes les {interval} secondes\u00a0: +{ants} [[A]], -{larvae} [[L]].",
    "unit.soldier.name": "Soldat d’élite",
    "unit.soldier.desc": "Sécurise le territoire lors des expéditions.\nIndispensable pour l’expansion.",

    /* ---------- Structures ---------- */
    "structure.storage.name": "Garde-manger",
    "structure.storage.desc": "Perfectionne le stockage\nAugmente la limite de nourriture",
    "structure.nursery.name": "Nurserie",
    "structure.nursery.desc": "Perfectionne le stockage\nAugmente la limite de larves",
    "structure.royalChamber.name": "Chambre royale",
    "structure.royalChamber.desc": "Centre du pouvoir.\nProduit des reines",

    /* ---------- Panneaux ---------- */
    "panel.achievements.title": "Succès",
    "panel.achievements.empty": "Aucun succès débloqué pour le moment.",
    "panel.legend.title": "Légende",
    "panel.log.title": "Journal",
    "log.clear": "Vider le journal",
    "log.resetGame": "Supprimer la sauvegarde",
    "log.type.status": "État",
    "log.type.success": "Trouvaille d’expédition",
    "log.type.achievement": "Succès obtenu",
    "log.type.warning": "Avertissement",
    "log.type.system": "Système",

    /* ---------- Succès : général ---------- */
    "achievement.reached": "Atteint",
    "achievement.hiddenReward": "Récompense\u00a0:\u00a0???",
    "status.achievementUnlocked": "Succès\u00a0: {title}",
    "log.achievementUnlocked": "Succès débloqué\u00a0: {title}",

    /* ---------- Messages ---------- */
    "status.production.queensStarved": "Production arrêtée\u00a0: pas assez de nourriture pour les reines\u00a0!",
    "status.production.starving": "Pénurie critique de nourriture\u00a0: la colonie a faim\u00a0!",
    "status.expeditionStarted": "Ta colonie est en expédition",
    "status.expeditionLockedByScout": "Les expéditions manuelles sont verrouillées\u00a0: l’éclaireuse les mène automatiquement.",
    "status.expedition.failed": "Expédition ratée\u00a0: rien n’a été trouvé.",
    "status.expedition.criticalSuccess": "Expédition très réussie\u00a0: {amount} unités de nourriture trouvées.",
    "status.expedition.success": "Expédition réussie\u00a0: {amount} unités de nourriture trouvées.",
    "status.ant.foundCritical": "Réussite critique\u00a0! Une fourmi a rejoint ta colonie\u00a0!",
    "status.ant.foundStray": "Une fourmi égarée a rejoint ta colonie\u00a0!",
    "status.scout.needAchievement": "Débloque d’abord le succès {achievement}.",
    "status.scout.alreadyTrained": "Tu as déjà entraîné une éclaireuse.",
    "status.scout.cannotAfford": "Les ressources ne suffisent pas pour l’éclaireuse.",
    "status.scout.trained": "Éclaireuse entraînée\u00a0!",
    "status.scout.unlocked": "Éclaireuse débloquée\u00a0!",
    "status.elite.requirements": "Tu as d’abord besoin d’un garde-manger et d’une nurserie.",
    "status.elite.maxReached": "Tu as déjà entraîné le nombre maximal de cette unité d’élite.",
    "status.elite.cannotAfford": "Les ressources ne suffisent pas pour cette unité d’élite.",
    "status.broodExpert.trained": "Experte du couvain entraînée\u00a0!",
    "status.grandNurse.trained": "Grande nourrice entraînée\u00a0! La capacité de ton stock de larves augmente.",
    "status.storageGuardian.trained": "Gardienne des réserves entraînée\u00a0! La capacité de ton stock de nourriture augmente.",
    "status.storage.built": "Garde-manger construit\u00a0!",
    "status.storage.effect": "La capacité maximale de nourriture a nettement augmenté\u00a0!",
    "status.nursery.built": "Nurserie construite\u00a0!",
    "status.nursery.effect": "La capacité maximale de larves a nettement augmenté\u00a0!",
    "status.structuresUnlocked": "Structures de base débloquées\u00a0!",
    "status.eliteUnlocked": "Unités spéciales débloquées\u00a0!",
    "status.logCleared": "Journal vidé.",
    "status.loadSuccess": "Sauvegarde chargée avec succès.",
    "status.loadMigrated": "Une ancienne sauvegarde a été convertie au nouveau format.",
    "status.loadFailed": "La sauvegarde n’a pas pu être chargée.",
    "error.invalidSaveFormat": "Format de sauvegarde invalide.",
    "confirm.resetGame": "Veux-tu vraiment supprimer toute la sauvegarde\u00a0? Cette action est irréversible\u00a0!",

    /* ---------- Succès : textes ---------- */
    "achievement.firstSteps.title": "Premiers pas",
    "achievement.firstSteps.locked": "{goal} expéditions terminées",
    "achievement.firstSteps.unlocked": "{goal} expéditions terminées",
    "achievement.firstSteps.reward": "Récompense\u00a0: menu des succès débloqué",

    "achievement.smallCollector.title": "Petit collecteur",
    "achievement.smallCollector.locked": "{goal} unités de nourriture récoltées",
    "achievement.smallCollector.unlocked": "{goal} unités de nourriture récoltées",
    "achievement.smallCollector.reward": "Récompense\u00a0: chance de trouver une fourmi égarée lors des expéditions",

    "achievement.smallColony.title": "Petite fourmilière",
    "achievement.smallColony.locked": "{goal} reines achetées",
    "achievement.smallColony.unlocked": "{goal} reines achetées",
    "achievement.smallColony.reward": "Récompense\u00a0: structures de base débloquées",

    "achievement.buildColony.title": "Construction de la colonie",
    "achievement.buildColony.locked": "Garde-manger et nurserie construits",
    "achievement.buildColony.unlocked": "Garde-manger et nurserie construits",
    "achievement.buildColony.reward": "Récompense\u00a0: unités spéciales débloquées",

    "achievement.knowledgeIsPower.title": "Le savoir, c’est le pouvoir",
    "achievement.knowledgeIsPower.locked": "Entraîner une gardienne des réserves et une grande nourrice",
    "achievement.knowledgeIsPower.unlocked": "Une gardienne des réserves et une grande nourrice entraînées",
    "achievement.knowledgeIsPower.reward": "Récompense\u00a0: recherche débloquée",
    "achievement.knowledgeIsPower.progress": "{guardians}/1 gardienne · {nurses}/1 nourrice",

    "achievement.foundTenAnts.title": "Sauveur de fourmis",
    "achievement.foundTenAnts.locked": "Trouver {goal} fourmis égarées lors des expéditions",
    "achievement.foundTenAnts.unlocked": "{goal} fourmis égarées trouvées lors des expéditions",
    "achievement.foundTenAnts.reward": "Récompense\u00a0: chance de trouver des fourmis égarées doublée",

    "achievement.expeditionVeteran.title": "Vétéran des expéditions",
    "achievement.expeditionVeteran.locked": "Terminer {goal} expéditions",
    "achievement.expeditionVeteran.unlocked": "{goal} expéditions terminées",
    "achievement.expeditionVeteran.reward": "Récompense\u00a0: chance d’expéditions très réussies doublée",

    "achievement.speedExpeditions.title": "Pattes agiles",
    "achievement.speedExpeditions.locked": "Terminer {goal} expéditions",
    "achievement.speedExpeditions.unlocked": "{goal} expéditions terminées",
    "achievement.speedExpeditions.reward": "Récompense\u00a0: durée des expéditions réduite définitivement à 5 secondes",

    "achievement.expeditionCommander.title": "Commandement d’expédition",
    "achievement.expeditionCommander.locked": "Terminer {goal} expéditions",
    "achievement.expeditionCommander.unlocked": "{goal} expéditions terminées",
    "achievement.expeditionCommander.reward": "Récompense\u00a0: éclaireuse débloquée",

    "achievement.criticalMastery.title": "Maître des expéditions",
    "achievement.criticalMastery.locked": "Terminer {goal} expéditions très réussies",
    "achievement.criticalMastery.unlocked": "{goal} expéditions très réussies terminées",
    "achievement.criticalMastery.reward": "Récompense\u00a0: les expéditions très réussies trouvent toujours une fourmi et rapportent 50\u00a0% de nourriture en plus",

    "achievement.goldenAge.title": "L’âge d’or",
    "achievement.goldenAge.locked": "250 expéditions très réussies, 300 fourmis trouvées et 25 reines",
    "achievement.goldenAge.unlocked": "250 expéditions très réussies, 300 fourmis trouvées et 25 reines",
    "achievement.goldenAge.reward": "Récompense\u00a0: les fourmis normales ne consomment plus de nourriture",
    "achievement.goldenAge.progress": "{critical}/250 expéditions très réussies · {ants}/300 fourmis trouvées · {queens}/25 reines",

    "achievement.expeditionMisfortune.title": "Poissard",
    "achievement.expeditionMisfortune.locked": "Subir {goal} expéditions ratées",
    "achievement.expeditionMisfortune.unlocked": "{goal} expéditions ratées subies",
    "achievement.expeditionMisfortune.reward": "Récompense\u00a0: la probabilité d’échec diminue de 50\u00a0%",

    "achievement.expeditionMisfortuneMaster.title": "Maître de la malchance",
    "achievement.expeditionMisfortuneMaster.locked": "Subir {goal} expéditions ratées",
    "achievement.expeditionMisfortuneMaster.unlocked": "{goal} expéditions ratées subies",
    "achievement.expeditionMisfortuneMaster.reward": "Récompense\u00a0: la probabilité d’échec diminue encore",

    "achievement.expeditionMisfortuneLegend.title": "Légende de la malchance",
    "achievement.expeditionMisfortuneLegend.locked": "Subir {goal} expéditions ratées",
    "achievement.expeditionMisfortuneLegend.unlocked": "{goal} expéditions ratées subies",
    "achievement.expeditionMisfortuneLegend.reward": "Récompense\u00a0: les expéditions n’échouent plus et la chance de réussites critiques augmente de 50\u00a0%",

    /* ---------- Page d’accueil (index.html) ---------- */
    "landing.pageTitle": "Idle Ant Empire",
    "landing.metaDescription": "Façonne ton royaume de fourmis, récolte des ressources et bâtis un puissant empire de fourmis dans Idle Ant Empire.",
    "landing.brandLabel": "Idle Ant Empire – Accueil",
    "landing.navLabel": "Navigation principale",
    "landing.languageMenuLabel": "Choisir la langue",
    "landing.languageActive": "Active",
    "landing.play": "Jouer",
    "landing.eyebrow": "Ta colonie. Ton empire.",
    "landing.heroDescription": "Commence avec une petite colonie, récolte des ressources et bâtis un puissant empire de fourmis.",
    "landing.cta": "Bâtir ta colonie",
    "landing.note": "Ton royaume de fourmis t’attend.",
    "landing.pillarsLabel": "Principe du jeu",
    "landing.pillar.build": "Construire",
    "landing.pillar.improve": "Améliorer",
    "landing.pillar.discover": "Découvrir",

    /* ---------- Menu des options et lecteur de musique ---------- */
    "options.button": "Options",
    "research.button": "Recherche",
    "options.title": "Options",
    "options.close": "Fermer",
    "options.language": "Langue",
    "options.music": "Musique",
    "options.volume": "Volume",
    "music.enabled": "Musique activée",
    "music.play": "Lecture",
    "music.pause": "Pause",
    "music.volumeValue": "{value}\u00a0%",
    "music.status.off": "La musique est désactivée.",
    "music.status.ready": "Prête.",
    "music.status.loading": "Chargement de la musique ...",
    "music.status.playing": "Lecture en cours\u00a0: piste {track}",
    "music.status.gap": "Pause entre les pistes – prochaine piste\u00a0: {track}",
    "music.status.paused": "En pause.",
    "music.status.blocked": "Le navigateur a bloqué la lecture automatique. Clique sur Lecture pour démarrer la musique.",
    "music.status.error": "Le fichier de musique n’a pas pu être chargé."
});
