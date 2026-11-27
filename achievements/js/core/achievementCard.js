/* =========================
   Erfolge: Karten, Reihen und einklappbare Kategorien
========================= */
const ACHIEVEMENT_CATEGORY_ORDER = [
 {id:"basic",icon:"✦"},{id:"collect",icon:"📦"},{id:"build",icon:"🏗"},{id:"units",icon:"🐜"},
 {id:"expedition",icon:"🧭"},{id:"research",icon:"⚗"},{id:"military",icon:"⚔"},{id:"ep",icon:"⭐"},{id:"other",icon:"🏆"}
];
const ACHIEVEMENT_SERIES = [
 {id:"colonyMilestones",category:"basic",titleKey:"achievements.series.colonyMilestones",icon:"🏡",ids:["firstSteps","goldenAge","knowledgeIsPower"]},
 {id:"gatheringAchievements",category:"collect",titleKey:"achievements.series.gatheringAchievements",icon:"📦",ids:["smallCollector"]},
 {id:"foodReserves",category:"collect",titleKey:"achievements.series.foodReserves",icon:"🥫",ids:["foodReserve1000","foodReserve10000"]},
 {id:"larvaeReserves",category:"units",titleKey:"achievements.series.larvaeReserves",icon:"🐛",ids:["larvaeReserve100","larvaeReserve500"]},
 {id:"colonyConstruction",category:"build",titleKey:"achievements.series.colonyConstruction",icon:"🏗️",ids:["buildColony"]},
 {id:"ants",category:"units",titleKey:"achievements.series.ants",icon:"🐜",ids:["purchasedAnts1","purchasedAnts10","purchasedAnts50","purchasedAnts100","purchasedAnts250","purchasedAnts500","purchasedAnts1000","purchasedAnts2000","purchasedAnts5000"]},
 {id:"queens",category:"units",titleKey:"achievements.series.queens",icon:"👑",ids:["smallColony","queenColonyTwentyFive","queenColonyHundred","queenCourt250","queenEmpire500"]},
 {id:"collectors",category:"units",titleKey:"achievements.series.collectors",icon:"🍄",ids:["collector10","collector25","collector50","collector100","collector250","collectorHarvest500","collectorHarvest1000"]},
 {id:"farms",category:"build",titleKey:"achievements.series.farms",icon:"🍄",ids:["mushroomFarmTen","mushroomFarmTwentyFive","mushroomFarmFifty","mushroomFarmHundred","mushroomFarmTwoFifty","mushroomFarmSettlement500","mushroomFarmMetropolis1000"]},
 {id:"completedExpeditions",category:"expedition",titleKey:"achievements.series.completedExpeditions",icon:"🧭",ids:["expeditionVeteran","speedExpeditions","expeditionCommander","expeditionColony2500","expeditionWorld5000"]},
 {id:"verySuccessfulExpeditions",category:"expedition",titleKey:"achievements.series.verySuccessfulExpeditions",icon:"⭐",ids:["criticalMastery","criticalFortune500","criticalFortune1000"]},
 {id:"expeditionAchievements",category:"expedition",titleKey:"achievements.series.expeditionAchievements",icon:"🏆",ids:["foundTenAnts","colonyRescuer25"]},
 {id:"expeditionFailures",category:"expedition",titleKey:"achievements.series.expeditionFailures",icon:"🛡️",ids:["expeditionMisfortune","expeditionMisfortuneMaster","expeditionMisfortuneLegend"]}
];
function getAchievementDefinition(id){return ACHIEVEMENTS.find(item=>item.id===id);}
function getAchievementCategory(id){const d=getAchievementDefinition(id);return d&&d.category?d.category:"other";}
function getAchievementSeries(id){return ACHIEVEMENT_SERIES.find(s=>s.ids.includes(id));}
function isAchievementSeriesStageVisible(id){
 const s=getAchievementSeries(id); if(!s)return true;
 // Kolonie-Meilensteine sind unabhängige Erfolge und werden immer gemeinsam angezeigt.
 if(s.id==="colonyMilestones")return true;
 const i=s.ids.indexOf(id);
 return !!GameState.achievements[id] || s.ids.slice(0,i).every(previous=>GameState.achievements[previous]);
}
function createAchievementToggle(group,title,icon,countClass,cards,expanded){
 const heading=document.createElement("button"); heading.type="button"; heading.className="achievement-category-toggle";
 heading.setAttribute("aria-expanded",String(expanded));
 heading.innerHTML='<span class="achievement-category-icon" aria-hidden="true">'+icon+'</span><span class="achievement-category-name">'+title+'</span><span class="achievement-points-count">0 / 0 EP</span><span class="achievement-category-count '+countClass+'">0 / 0</span><span class="achievement-category-chevron" aria-hidden="true">⌄</span>';
 cards.hidden=!expanded;
 heading.addEventListener("click",()=>{const open=heading.getAttribute("aria-expanded")==="true";heading.setAttribute("aria-expanded",String(!open));cards.hidden=open;group.classList.toggle("is-collapsed",open);});
 group.append(heading,cards);
}
function getAchievementCategoryContainer(categoryId){
 if(!DOM.achievementList)return null;
 let group=DOM.achievementList.querySelector('[data-achievement-category="'+categoryId+'"]');
 if(group)return group.querySelector(":scope > .achievement-category-cards");
 const category=ACHIEVEMENT_CATEGORY_ORDER.find(x=>x.id===categoryId)||ACHIEVEMENT_CATEGORY_ORDER[ACHIEVEMENT_CATEGORY_ORDER.length-1];
 group=document.createElement("section");group.className="achievement-category";group.dataset.achievementCategory=category.id;
 const cards=document.createElement("div");cards.className="achievement-category-cards";
 createAchievementToggle(group,I18N.tPlain("achievements.cat."+category.id),category.icon,"achievement-category-count",cards,true);
 const order=ACHIEVEMENT_CATEGORY_ORDER.findIndex(x=>x.id===category.id);
 const before=Array.from(DOM.achievementList.querySelectorAll(":scope > .achievement-category")).find(x=>ACHIEVEMENT_CATEGORY_ORDER.findIndex(c=>c.id===x.dataset.achievementCategory)>order);
 if(before)DOM.achievementList.insertBefore(group,before);else DOM.achievementList.appendChild(group);
 return cards;
}
function getAchievementSeriesContainer(series){
 const parent=getAchievementCategoryContainer(series.category);if(!parent)return null;
 let group=parent.querySelector('[data-achievement-series="'+series.id+'"]');
 if(group)return group.querySelector(":scope > .achievement-series-cards");
 group=document.createElement("section");group.className="achievement-series";group.dataset.achievementSeries=series.id;
 const cards=document.createElement("div");cards.className="achievement-series-cards";
 createAchievementToggle(group,I18N.tPlain(series.titleKey),series.icon,"achievement-series-count",cards,false);
 const index=ACHIEVEMENT_SERIES.findIndex(x=>x.id===series.id);
 const before=Array.from(parent.querySelectorAll(":scope > .achievement-series")).find(x=>ACHIEVEMENT_SERIES.findIndex(s=>s.id===x.dataset.achievementSeries)>index);
 if(before)parent.insertBefore(group,before);else parent.appendChild(group);
 return cards;
}
function refreshAchievementCategoryCounts(){
 if(!DOM.achievementList)return;
 DOM.achievementList.querySelectorAll(".achievement-category").forEach(group=>{
  const categoryId=group.dataset.achievementCategory;
  const definitions=ACHIEVEMENTS.filter(item=>(item.category||"other")===categoryId);
  const unlocked=definitions.filter(item=>GameState.achievements[item.id]).length;
  const earnedEP=definitions.reduce((sum,item)=>sum+(GameState.achievements[item.id]?Math.max(0,Number(item.epReward)||0):0),0);
  const possibleEP=definitions.reduce((sum,item)=>sum+Math.max(0,Number(item.epReward)||0),0);
  const epCount=group.querySelector(":scope > .achievement-category-toggle .achievement-points-count");
  const count=group.querySelector(":scope > .achievement-category-toggle .achievement-category-count");
  if(epCount)epCount.textContent=formatGameNumber(earnedEP)+" / "+formatGameNumber(possibleEP)+" EP";
  if(count)count.textContent=unlocked+" / "+definitions.length;
 });
 ACHIEVEMENT_SERIES.forEach(series=>{
  const group=DOM.achievementList.querySelector('[data-achievement-series="'+series.id+'"]');if(!group)return;
  const definitions=series.ids.map(getAchievementDefinition).filter(Boolean);
  const unlocked=definitions.filter(item=>GameState.achievements[item.id]).length;
  const earnedEP=definitions.reduce((sum,item)=>sum+(GameState.achievements[item.id]?Math.max(0,Number(item.epReward)||0):0),0);
  const possibleEP=definitions.reduce((sum,item)=>sum+Math.max(0,Number(item.epReward)||0),0);
  const epCount=group.querySelector(".achievement-points-count");
  const count=group.querySelector(".achievement-series-count");
  if(epCount)epCount.textContent=formatGameNumber(earnedEP)+" / "+formatGameNumber(possibleEP)+" EP";
  if(count)count.textContent=I18N.t("achievements.series.progress",{unlocked:unlocked,total:definitions.length});
 });
}
function renderAchievementCard(id,content,isUnlocked=false,progressPercent=0){
 if(!DOM.achievementList||!isAchievementSeriesStageVisible(id))return;
 if(DOM.noAchievementsMsg){DOM.noAchievementsMsg.remove();DOM.noAchievementsMsg=null;}
 const series=getAchievementSeries(id);
 const target=series?getAchievementSeriesContainer(series):getAchievementCategoryContainer(getAchievementCategory(id));
 if(!target)return;
 let card=document.getElementById("ach-"+id);
 if(!card){card=document.createElement("article");card.id="ach-"+id;card.dataset.achievementId=id;card.className="achievement-card";}
 if(card.parentElement!==target)target.appendChild(card);
 card.className="achievement-card "+(isUnlocked?"unlocked":"locked");
 if(isUnlocked)card.style.removeProperty("--ach-progress");else card.style.setProperty("--ach-progress",progressPercent+"%");
 const progressText=isUnlocked?I18N.t("achievement.reached"):content.progressText;
 const signature=[content.title,content.desc,content.rewardText,isUnlocked,progressText].join("|");
 if(card.dataset.signature!==signature){
  card.dataset.signature=signature;
  const row=document.createElement("div");row.className="ach-title";
  const title=document.createElement("span");title.textContent=content.title;
  const progress=document.createElement("span");progress.className="ach-progress-text";progress.textContent=progressText;row.append(title,progress);
  const desc=document.createElement("p");desc.className="ach-desc";desc.textContent=content.desc;
  const reward=document.createElement("p");reward.className="ach-reward";reward.textContent=content.rewardText;
  card.replaceChildren(row,desc,reward);
 }
 if(!series&&getAchievementCategory(id)==="units"){
  const cards=Array.from(target.querySelectorAll(":scope > .achievement-card"));
  cards.sort((a,b)=>{const da=getAchievementDefinition(a.dataset.achievementId)||{},db=getAchievementDefinition(b.dataset.achievementId)||{};const diff=(da.unitGroupOrder||99)-(db.unitGroupOrder||99);if(diff)return diff;const unlocked=Number(b.classList.contains("unlocked"))-Number(a.classList.contains("unlocked"));return unlocked||(da.order||0)-(db.order||0);});
  cards.forEach(item=>target.appendChild(item));
 }
 refreshAchievementCategoryCounts();
}
