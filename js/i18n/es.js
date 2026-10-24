/* =========================
    Traducciones: Español
    Las claves que falten usan el alemán como respaldo (ver i18n.js). Mantén el mismo conjunto de claves que de.js.
    Marcadores: {name}   Abreviaturas de recursos: [[F]]   Salto de línea: \n
========================= */

I18N.register("es", {

    /* ---------- Pantalla de carga ---------- */
    "loading.subtitle": "Preparando tu colonia ...",
    "loading.initial": "Reuniendo a las hormigas ...",
    "loading.progressLabel": "Cargando el juego",
    "loading.gathering": "Reuniendo a tus hormigas ...",
    "loading.modules": "Cargando módulos del juego ... ({current}/{total})",
    "loading.awakening": "Tu colonia está despertando ...",
    "loading.ready": "¡Tu colonia está lista!",
    "loading.failedStatus": "La carga ha fallado. Revisa el mensaje de error.",
    "loading.failedTitle": "¡Vaya! Algo ha salido mal.",
    "loading.unknownError": "Error de carga desconocido.",
    "loading.scriptError": "Error al cargar: {path}",

    /* ---------- Recursos ---------- */
    "resource.food": "Comida",
    "resource.larvae": "Larvas",
    "resource.ant": "Hormiga",
    "resource.queen": "Reina",
    "resource.soldier": "Soldado de élite",

    /* ---------- Interfaz general ---------- */
    "ui.total": "Total:",
    "ui.bought": "Compradas:",
    "ui.count": "Cantidad:",
    "ui.language": "Idioma",
    "ui.legend": "Leyenda",
    "ui.log": "Registro",
    "ui.achievements": "Logros",
    "ui.achievementsLocked": "Logros aún bloqueados",
    "status.label": "Estado:",
    "status.init": "Inicializando...",
    "status.default": "Tu colonia está lista y a la espera",

    "button.build": "Construir",
    "button.built": "Construida",
    "button.locked": "Bloqueado",
    "button.maxReached": "Máximo alcanzado",
    "button.missingResources": "Faltan recursos",
    "button.train": "Entrenar",

    /* ---------- Categorías ---------- */
    "category.basisUnits": "Unidades básicas",
    "category.eliteUnits": "Unidades de élite",
    "category.basisStructures": "Estructuras básicas",

    /* ---------- Expedición ---------- */
    "expedition.start": "Salir de expedición ({seconds} s)",
    "expedition.running": "De expedición",
    "expedition.scoutLockedTitle": "La exploradora realiza las expediciones automáticamente.",

    /* ---------- Unidades ---------- */
    "unit.ant.name": "Hormiga",
    "unit.ant.desc": "Recolecta {production} [[F]] /s\nNecesita {consumption} [[F]] /s",
    "unit.ant.buy": "Comprar hormiga",
    "unit.queen.name": "Reina",
    "unit.queen.desc": "Produce {production} [[L]] /s\nNecesita {consumption} [[F]] /s",
    "unit.queen.buy": "Comprar reina",
    "unit.scout.name": "Exploradora",
    "unit.scout.desc": "Automatiza las expediciones.\nPero necesita descansos",
    "unit.storageGuardian.name": "Guardiana de la despensa",
    "unit.storageGuardian.desc": "Duplica el almacén de comida.\nConsume {upkeep} [[F]]/s.",
    "unit.grandNurse.name": "Gran nodriza",
    "unit.grandNurse.desc": "Duplica el almacén de larvas.\nConsume {upkeep} [[F]]/s.",
    "unit.broodExpert.name": "Experta en cría",
    "unit.broodExpert.desc": "Cría hormigas nuevas a partir de larvas.\nCada {interval} segundos: +{ants} [[A]], -{larvae} [[L]].",
    "unit.soldier.name": "Soldado de élite",
    "unit.soldier.desc": "Asegura territorio en las expediciones.\nNecesario para la expansión.",

    /* ---------- Estructuras ---------- */
    "structure.storage.name": "Despensa",
    "structure.storage.desc": "Perfecciona el almacenamiento\nAumenta el límite de comida",
    "structure.nursery.name": "Sala de cría",
    "structure.nursery.desc": "Perfecciona el almacenamiento\nAumenta el límite de larvas",
    "structure.royalChamber.name": "Cámara real",
    "structure.royalChamber.desc": "Centro del poder.\nProduce reinas",

    /* ---------- Paneles ---------- */
    "panel.achievements.title": "Logros",
    "panel.achievements.empty": "Aún no has desbloqueado ningún logro.",
    "panel.legend.title": "Leyenda",
    "panel.log.title": "Registro",
    "log.clear": "Vaciar registro",
    "log.resetGame": "Borrar partida",
    "log.type.status": "Estado",
    "log.type.success": "Hallazgo de expedición",
    "log.type.achievement": "Logro conseguido",
    "log.type.warning": "Aviso",
    "log.type.system": "Sistema",

    /* ---------- Logros: general ---------- */
    "achievement.reached": "Conseguido",
    "achievement.hiddenReward": "Recompensa: ???",
    "status.achievementUnlocked": "Logro: {title}",
    "log.achievementUnlocked": "Logro desbloqueado: {title}",

    /* ---------- Mensajes ---------- */
    "status.production.queensStarved": "Producción detenida: ¡no hay suficiente comida para las reinas!",
    "status.production.starving": "Escasez crítica de comida: ¡la colonia pasa hambre!",
    "status.expeditionStarted": "Tu colonia está de expedición",
    "status.expeditionLockedByScout": "Las expediciones manuales están bloqueadas: la exploradora las realiza automáticamente.",
    "status.expedition.failed": "Expedición fallida: no se ha encontrado nada.",
    "status.expedition.criticalSuccess": "Expedición muy exitosa: se han encontrado {amount} unidades de comida.",
    "status.expedition.success": "Expedición exitosa: se han encontrado {amount} unidades de comida.",
    "status.ant.foundCritical": "¡Éxito crítico! ¡Una hormiga se ha unido a tu colonia!",
    "status.ant.foundStray": "¡Una hormiga extraviada se ha unido a tu colonia!",
    "status.scout.needAchievement": "Primero desbloquea el logro {achievement}.",
    "status.scout.alreadyTrained": "Ya has entrenado a una exploradora.",
    "status.scout.cannotAfford": "No tienes recursos suficientes para la exploradora.",
    "status.scout.trained": "¡Exploradora entrenada!",
    "status.scout.unlocked": "¡Exploradora desbloqueada!",
    "status.elite.requirements": "Primero necesitas una despensa y una sala de cría.",
    "status.elite.maxReached": "Ya has entrenado el número máximo de esta unidad de élite.",
    "status.elite.cannotAfford": "No tienes recursos suficientes para esta unidad de élite.",
    "status.broodExpert.trained": "¡Experta en cría entrenada!",
    "status.grandNurse.trained": "¡Gran nodriza entrenada! La capacidad de tu almacén de larvas aumenta.",
    "status.storageGuardian.trained": "¡Guardiana de la despensa entrenada! La capacidad de tu almacén de comida aumenta.",
    "status.storage.built": "¡Despensa construida!",
    "status.storage.effect": "¡La capacidad máxima de comida ha aumentado notablemente!",
    "status.nursery.built": "¡Sala de cría construida!",
    "status.nursery.effect": "¡La capacidad máxima de larvas ha aumentado notablemente!",
    "status.structuresUnlocked": "¡Estructuras básicas desbloqueadas!",
    "status.eliteUnlocked": "¡Unidades especiales desbloqueadas!",
    "status.logCleared": "Registro vaciado.",
    "status.loadSuccess": "Partida cargada correctamente.",
    "status.loadMigrated": "Una partida antigua se ha convertido al nuevo formato.",
    "status.loadFailed": "No se pudo cargar la partida.",
    "error.invalidSaveFormat": "Formato de guardado no válido.",
    "confirm.resetGame": "¿De verdad quieres borrar toda la partida? ¡Esta acción no se puede deshacer!",

    /* ---------- Logros: textos ---------- */
    "achievement.firstSteps.title": "Primeros pasos",
    "achievement.firstSteps.locked": "{goal} expediciones completadas",
    "achievement.firstSteps.unlocked": "{goal} expediciones completadas",
    "achievement.firstSteps.reward": "Recompensa: menú de logros desbloqueado",

    "achievement.smallCollector.title": "Pequeño recolector",
    "achievement.smallCollector.locked": "{goal} unidades de comida recolectadas",
    "achievement.smallCollector.unlocked": "{goal} unidades de comida recolectadas",
    "achievement.smallCollector.reward": "Recompensa: posibilidad de encontrar una hormiga extraviada en las expediciones",

    "achievement.smallColony.title": "Pequeño hormiguero",
    "achievement.smallColony.locked": "{goal} reinas compradas",
    "achievement.smallColony.unlocked": "{goal} reinas compradas",
    "achievement.smallColony.reward": "Recompensa: estructuras básicas desbloqueadas",

    "achievement.buildColony.title": "Construcción de la colonia",
    "achievement.buildColony.locked": "Despensa y sala de cría construidas",
    "achievement.buildColony.unlocked": "Despensa y sala de cría construidas",
    "achievement.buildColony.reward": "Recompensa: unidades especiales desbloqueadas",

    "achievement.knowledgeIsPower.title": "El saber es poder",
    "achievement.knowledgeIsPower.locked": "Entrenar una guardiana de la despensa y una gran nodriza",
    "achievement.knowledgeIsPower.unlocked": "Has entrenado una guardiana de la despensa y una gran nodriza",
    "achievement.knowledgeIsPower.reward": "Recompensa: investigación desbloqueada",
    "achievement.knowledgeIsPower.progress": "{guardians}/1 guardiana · {nurses}/1 nodriza",

    "achievement.foundTenAnts.title": "Rescatador de hormigas",
    "achievement.foundTenAnts.locked": "Encontrar {goal} hormigas extraviadas en las expediciones",
    "achievement.foundTenAnts.unlocked": "Has encontrado {goal} hormigas extraviadas en las expediciones",
    "achievement.foundTenAnts.reward": "Recompensa: probabilidad de encontrar hormigas extraviadas duplicada",

    "achievement.expeditionVeteran.title": "Veterano de expediciones",
    "achievement.expeditionVeteran.locked": "Completar {goal} expediciones",
    "achievement.expeditionVeteran.unlocked": "Has completado {goal} expediciones",
    "achievement.expeditionVeteran.reward": "Recompensa: probabilidad de expediciones muy exitosas duplicada",

    "achievement.speedExpeditions.title": "Patas veloces",
    "achievement.speedExpeditions.locked": "Completar {goal} expediciones",
    "achievement.speedExpeditions.unlocked": "Has completado {goal} expediciones",
    "achievement.speedExpeditions.reward": "Recompensa: duración de las expediciones reducida permanentemente a 5 segundos",

    "achievement.expeditionCommander.title": "Mando de expediciones",
    "achievement.expeditionCommander.locked": "Completar {goal} expediciones",
    "achievement.expeditionCommander.unlocked": "Has completado {goal} expediciones",
    "achievement.expeditionCommander.reward": "Recompensa: exploradora desbloqueada",

    "achievement.criticalMastery.title": "Maestro de las expediciones",
    "achievement.criticalMastery.locked": "Completar {goal} expediciones muy exitosas",
    "achievement.criticalMastery.unlocked": "Has completado {goal} expediciones muy exitosas",
    "achievement.criticalMastery.reward": "Recompensa: las expediciones muy exitosas encuentran siempre una hormiga y aportan un 50 % más de comida",

    "achievement.goldenAge.title": "La edad de oro",
    "achievement.goldenAge.locked": "250 expediciones muy exitosas, 300 hormigas encontradas y 25 reinas",
    "achievement.goldenAge.unlocked": "250 expediciones muy exitosas, 300 hormigas encontradas y 25 reinas",
    "achievement.goldenAge.reward": "Recompensa: las hormigas normales ya no consumen comida",
    "achievement.goldenAge.progress": "{critical}/250 expediciones muy exitosas · {ants}/300 hormigas encontradas · {queens}/25 reinas",

    "achievement.expeditionMisfortune.title": "Gafe",
    "achievement.expeditionMisfortune.locked": "Sufrir {goal} expediciones fallidas",
    "achievement.expeditionMisfortune.unlocked": "Has sufrido {goal} expediciones fallidas",
    "achievement.expeditionMisfortune.reward": "Recompensa: la probabilidad de fracaso se reduce un 50 %",

    "achievement.expeditionMisfortuneMaster.title": "Maestro de la mala suerte",
    "achievement.expeditionMisfortuneMaster.locked": "Sufrir {goal} expediciones fallidas",
    "achievement.expeditionMisfortuneMaster.unlocked": "Has sufrido {goal} expediciones fallidas",
    "achievement.expeditionMisfortuneMaster.reward": "Recompensa: la probabilidad de fracaso se reduce aún más",

    "achievement.expeditionMisfortuneLegend.title": "Leyenda de la mala suerte",
    "achievement.expeditionMisfortuneLegend.locked": "Sufrir {goal} expediciones fallidas",
    "achievement.expeditionMisfortuneLegend.unlocked": "Has sufrido {goal} expediciones fallidas",
    "achievement.expeditionMisfortuneLegend.reward": "Recompensa: las expediciones ya no fracasan y la probabilidad de éxitos críticos aumenta un 50 %",

    /* ---------- Página de inicio (index.html) ---------- */
    "landing.pageTitle": "Idle Ant Empire",
    "landing.metaDescription": "Construye tu reino de hormigas, reúne recursos y crea un poderoso imperio de hormigas en Idle Ant Empire.",
    "landing.brandLabel": "Idle Ant Empire – Inicio",
    "landing.navLabel": "Navegación principal",
    "landing.languageMenuLabel": "Elegir idioma",
    "landing.languageActive": "Activo",
    "landing.play": "Jugar",
    "landing.eyebrow": "Tu colonia. Tu imperio.",
    "landing.heroDescription": "Empieza con una pequeña colonia, reúne recursos y crea un poderoso imperio de hormigas.",
    "landing.cta": "Construir la colonia",
    "landing.note": "Tu reino de hormigas te espera.",
    "landing.pillarsLabel": "Mecánica del juego",
    "landing.pillar.build": "Construir",
    "landing.pillar.improve": "Mejorar",
    "landing.pillar.discover": "Descubrir",

    /* ---------- Menú de opciones y reproductor de música ---------- */
    "options.button": "Opciones",
    "research.button": "Investigación",
    "options.title": "Opciones",
    "options.close": "Cerrar",
    "options.language": "Idioma",
    "options.music": "Música",
    "options.volume": "Volumen",
    "music.enabled": "Música activada",
    "music.play": "Reproducir",
    "music.pause": "Pausa",
    "music.volumeValue": "{value} %",
    "music.status.off": "La música está desactivada.",
    "music.status.ready": "Lista.",
    "music.status.loading": "Cargando la música ...",
    "music.status.playing": "Reproduciendo: pista {track}",
    "music.status.gap": "Pausa entre pistas – a continuación: pista {track}",
    "music.status.paused": "En pausa.",
    "music.status.blocked": "El navegador ha bloqueado la reproducción automática. Pulsa Reproducir para iniciar la música.",
    "music.status.error": "No se pudo cargar el archivo de música."
});
