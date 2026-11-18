/* ---------- Protein planner ---------- */
let pp=Object.assign({kg:"",gpk:"1.2",m:{b:"",l:"",d:"",s:""}},store.get("protein",{}));pp.m=pp.m||{};
function ppSave(){store.set("protein",pp);}
function ppRender(){const kgEl=$("#ppKg");if(!kgEl)return;if(document.activeElement!==kgEl)kgEl.value=pp.kg;
  $$("#ppGoal [data-v]").forEach(b=>{const on=b.dataset.v===pp.gpk;b.setAttribute("aria-checked",on?"true":"false");b.tabIndex=on?0:-1;});
  $$("[data-meal]").forEach(i=>{if(document.activeElement!==i)i.value=pp.m[i.dataset.meal]||"";});
  const kg=parseFloat(pp.kg),res=$("#ppRes"),say=$("#ppSay");
  if(!(kg>=35&&kg<=200)){res.innerHTML=`<p class="muted">Enter your weight to see your targets.</p>`;chartDef("chMeals",{empty:"Enter your weight and your meals to see your day."});say.textContent="";return;}
  const g=parseFloat(pp.gpk),day=Math.round(kg*g),meal=Math.round(kg*0.4),rdi=46;
  res.innerHTML=`<div class="stats pp-stats"><div class="stat"><span class="num">${day} g</span><p>a day at ${g.toFixed(1)} g per kg. ${({"1.0":"The least that expert groups suggest for older adults.","1.2":"Suggested for active older adults and anyone strength training.","1.4":"Within the range that suits strength training.","1.6":"About where extra protein stopped adding muscle in trials."})[pp.gpk]||""} <span class="ev" data-r="${g>=1.6?"MORTON":"PROTAGE ESPEN"}"></span></p></div><div class="stat"><span class="num">~${meal} g</span><p>at each of three main meals (0.4 g per kg), the amount that fully switched on muscle building in older men in laboratory studies. <span class="ev" data-g="weak" data-r="MOORE"></span></p></div></div><p class="small muted">For comparison, the recommended dietary intake for women is ${rdi} g a day (57 g over 70). <span class="ev" data-r="NRV"></span></p>`;renderEv(res);
  const keys=["b","l","d","s"],names=["Breakfast","Lunch","Dinner","Snacks"];const vals=keys.map(k=>Math.max(0,parseFloat(pp.m[k])||0));const tot=vals.reduce((a,b)=>a+b,0);
  if(!tot){chartDef("chMeals",{empty:"Fill in your meals above to see how your day measures up."});say.textContent="";return;}
  chartDef("chMeals",{type:"bar",label:"Protein in each meal compared with your per-meal target",cats:names,values:vals,target:meal,judge:[0,1,2],targetLabel:"Per-meal target "+meal+" g",fmt:v=>Math.round(v)+" g",catName:"Meal",valName:"Protein (g)",h:230});
  const short=[0,1,2].filter(i=>vals[i]<meal).map(i=>names[i].toLowerCase());
  say.textContent=`Total ${Math.round(tot)} g of your ${day} g target (${Math.round(tot/day*100)}%).`+(short.length?` To spread it more evenly, add protein to ${short.join(" and ")}.`:" All three main meals reach the per-meal target.");}
D.addEventListener("input",e=>{if(e.target.id==="ppKg"){pp.kg=e.target.value;ppSave();ppRender();}else if(e.target.dataset&&e.target.dataset.meal){pp.m[e.target.dataset.meal]=e.target.value;ppSave();ppRender();}});
D.addEventListener("click",e=>{const b=e.target.closest("#ppGoal [data-v]");if(!b)return;pp.gpk=b.dataset.v;ppSave();ppRender();});
D.addEventListener("keydown",e=>{const b=e.target.closest&&e.target.closest("#ppGoal [data-v]");if(!b)return;if(!["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault();const bs=$$("#ppGoal [data-v]"),i=bs.indexOf(b),j=(i+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1)+bs.length)%bs.length;pp.gpk=bs[j].dataset.v;ppSave();ppRender();bs[j].focus();});
onView("protein",ppRender);
