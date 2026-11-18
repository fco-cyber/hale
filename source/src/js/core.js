"use strict";
const D=document, R=D.documentElement;
const $=(s,r)=>(r||D).querySelector(s), $$=(s,r)=>Array.from((r||D).querySelectorAll(s));
const PFX="hale:";
const store={get(k,d){try{const v=localStorage.getItem(PFX+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(PFX+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(PFX+k)}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const todayISO=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
const fmtDate=iso=>{try{const [y,m,d]=iso.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"});}catch(e){return iso;}};
R.setAttribute("lang","en-AU");

/* ---------- Evidence: topics, grades and plain-English terms ---------- */
const TOPICS={all:"All",muscle:"Muscle and ageing",menopause:"Menopause",train:"Training",safe:"Safety and conditions",bone:"Bone and falls",mind:"Mood and sleep",protein:"Protein",eat:"Eating and weight",supps:"Supplements",tests:"Self-checks"};
const GRADE={strong:["g-strong","Strong"],mod:["g-mod","Moderate"],weak:["g-weak","Weak"],no:["g-no","Not supported"]};
const GLOSS={
resistance:["Resistance training","Exercise where your muscles work against a load, such as your body weight, a band, dumbbells or a machine. Also called strength training."],
rep:["Repetition (rep)","One complete movement of an exercise, such as standing up from a chair once."],
set:["Set","A group of repetitions done one after another before a rest, such as 10 sit-to-stands."],
rir:["Reps in reserve","How many more good repetitions you could have done when you stopped the set. Stopping with 1 to 3 left is hard enough to build strength without going to complete exhaustion."],
onerm:["One-repetition maximum (1RM)","The heaviest weight you can lift once with good form. Studies describe loads as a percentage of it: 80% of 1RM is heavy, 50% is light."],
overload:["Progressive overload","Gradually asking a little more of your muscles over the weeks, by adding repetitions, sets or weight, so they keep adapting."],
sarcopenia:["Sarcopenia","Loss of muscle strength together with low muscle mass or quality, usually with age. It raises the risk of falls, disability and poorer health."],
lean:["Lean mass","Everything in the body that isn't fat or bone mineral: mostly muscle, organs and water. Body scans use it as a stand-in for muscle."],
ffm:["Fat-free mass","Body weight minus fat: muscle, bone, organs and water."],
bmd:["Bone mineral density","How much mineral is packed into a section of bone, measured with a DXA scan. Lower density means weaker bone."],
osteopenia:["Osteopenia","Bone density below the average for young adults, but not low enough to be called osteoporosis (a T-score between −1 and −2.5)."],
osteoporosis:["Osteoporosis","Bone that has become thin and fragile (a T-score of −2.5 or lower), so it breaks more easily, often after a minor fall."],
dxa:["DXA scan","A low-dose X-ray scan that measures bone density. It can also measure fat and lean mass."],
transition:["Menopause transition","The years before the final period, also called perimenopause, when periods become irregular and hormone levels swing."],
fmp:["Final menstrual period","Your last period. It is only known looking back, after 12 months without one."],
mht:["Menopausal hormone therapy (MHT)","Oestrogen, usually with a progestogen, prescribed for menopause symptoms. Also called HRT."],
hypertrophy:["Hypertrophy","Growth in the size of muscle fibres, and so of the muscle."],
power:["Muscle power","Force produced quickly: how briskly you can stand up, climb a step or catch yourself after a trip."],
mps:["Muscle protein synthesis","The constant building of new muscle protein. Eating protein and strength training both switch it on."],
leucine:["Leucine","An amino acid (a building block of protein) that signals muscle to start building. Dairy, meat, fish, eggs and soy are good sources."],
creatine:["Creatine","A compound made in the body and found in meat and fish. It helps muscles make short bursts of energy. Creatine monohydrate is the form studied as a supplement."],
glp1:["GLP-1 medicines","Medicines such as semaglutide and tirzepatide that copy gut hormones called incretins. They reduce appetite and are used for diabetes and weight loss."],
pelvicfloor:["Pelvic floor","The sling of muscles at the base of the pelvis that supports the bladder, bowel and uterus and helps prevent leaking."],
prolapse:["Pelvic organ prolapse","When the bladder, uterus or bowel drops down into the vagina, often felt as a bulge, dragging or heaviness."],
valsalva:["Breath holding (Valsalva)","Holding your breath while straining. It briefly raises blood pressure and pressure on the pelvic floor. Breathing out during the effort avoids it."],
meta:["Meta-analysis","A study that pools the results of many earlier studies to give a more reliable overall answer."],
rct:["Randomised trial","A study in which people are allocated by chance to a treatment or a comparison, so differences in results can be put down to the treatment."],
cohort:["Cohort study","A study that follows a group of people over time and looks for links between habits and health. It shows links, not cause and effect."],
es:["Effect size","A standard way of describing how big a difference is: about 0.2 is small, 0.5 moderate and 0.8 or more large."],
aep:["Accredited Exercise Physiologist","A university-qualified allied health professional who prescribes exercise for health conditions and injuries, accredited by Exercise & Sports Science Australia (ESSA)."],
sarcomere:["Sarcomere","The smallest unit of muscle that contracts. Thousands sit end to end along each muscle fibre."],
myofibril:["Myofibril","A long thread inside a muscle fibre, made of sarcomeres in a row."],
fascicle:["Fascicle","A bundle of muscle fibres wrapped in connective tissue. A muscle is made of many fascicles."],
frailty:["Frailty","Reduced physical reserve, so that small stresses such as an infection or a fall have a big effect on health and independence."],
rdi:["Recommended dietary intake (RDI)","The daily amount of a nutrient that meets the needs of nearly all healthy people of a given age and sex."]
};

/* ---------- Navigation ---------- */
const NAV=[
{id:"start",l:"Start here",s:"Why strength, why now",g:"Understand"},
{id:"muscle",l:"Muscle after 40",s:"What changes and why it matters"},
{id:"menopause",l:"Menopause and muscle",s:"Hormones, body shape, bone"},
{id:"mind",l:"Mind and motivation",s:"Mood, sleep, habits"},
{id:"train",l:"How to train",s:"Principles that build muscle",g:"Train"},
{id:"safe",l:"Starting safely",s:"Check-in, pain, pelvic floor"},
{id:"moves",l:"Exercise library",s:"Key movements, step by step"},
{id:"plan",l:"My programme",s:"Build a plan, log sessions"},
{id:"bones",l:"Bones and balance",s:"Osteoporosis and falls"},
{id:"protein",l:"Protein",s:"How much, and when",g:"Eat"},
{id:"eat",l:"Eating for muscle",s:"Meals, weight loss, GLP-1"},
{id:"supps",l:"Supplements",s:"What helps, what doesn't"},
{id:"tests",l:"Self-checks",s:"Chair stand, grip, SARC-F",g:"Check and support"},
{id:"evidence",l:"Evidence library",s:"Sources and grades"},
{id:"support",l:"Getting help",s:"People and services"}
];
function navHTML(){return NAV.map(n=>(n.g?`<li class="grp" aria-hidden="true">${n.g}</li>`:"")+`<li><a href="#${n.id}" data-id="${n.id}"><span class="node" aria-hidden="true"></span><span><span class="lbl">${n.l}</span><span class="sub">${n.s}</span></span></a></li>`).join("");}
$("#thread").innerHTML=navHTML();$("#threadM").innerHTML=navHTML();
$$(".view").forEach(v=>{const i=NAV.findIndex(n=>n.id===v.dataset.view);const p=NAV[i-1],n=NAV[i+1];const nav=D.createElement("nav");nav.className="pager";nav.setAttribute("aria-label","Previous and next section");nav.innerHTML=(p?`<a class="prev" href="#${p.id}"><span class="dir">Previous</span><span>${p.l}</span></a>`:"")+(n?`<a class="next" href="#${n.id}"><span class="dir">Next</span><span>${n.l}</span></a>`:"");v.appendChild(nav);});

/* ---------- Evidence chips ---------- */
function evHTML(g,refs){let h="";if(g==="cons")return `<span class="cn">clinical consensus</span>`;if(g&&GRADE[g])h+=`<span class="g ${GRADE[g][0]}">${GRADE[g][1]}</span>`;const ids=(refs||"").split(/\s+/).filter(Boolean);ids.forEach(id=>{const r=REFS[id];if(r)h+=`<button class="cite" data-r="${id}" aria-haspopup="dialog" aria-expanded="false">${esc(r.s)}</button>`;else console.warn("Missing ref",id);});if(!ids.length&&g)h+=`<span class="cn">clinical consensus</span>`;return h;}
function renderEv(root){$$(".ev",root).forEach(el=>{if(el.dataset.done)return;el.innerHTML=evHTML(el.dataset.g,el.dataset.r);el.dataset.done="1";});}
function wireTerms(root){$$("[data-t]",root).forEach(b=>{if(b.tagName!=="BUTTON")return;b.setAttribute("aria-haspopup","dialog");b.setAttribute("aria-expanded","false");if(!b.type)b.type="button";});}

/* ---------- Popover ---------- */
const pop=$("#pop");let popFor=null;
function refLinks(r){let l="";if(r.p)l+=`<a href="https://pubmed.ncbi.nlm.nih.gov/${r.p}/" target="_blank" rel="noopener">PMID ${r.p}</a>`;if(r.d)l+=`<a href="https://doi.org/${r.d}" target="_blank" rel="noopener">DOI ${esc(r.d)}</a>`;if(r.u)l+=`<a href="${r.u}" target="_blank" rel="noopener">Source</a>`;return l;}
function refPop(id){const r=REFS[id];if(!r)return"<p>Source not found.</p>";return `<h4>${esc(r.s)}</h4><p class="small muted">${esc(r.k)}${r.g?` · <span class="g ${GRADE[r.g][0]}">${GRADE[r.g][1]}</span>`:""}</p><p class="small"><strong>Who:</strong> ${esc(r.pop)}</p><p class="small"><strong>Found:</strong> ${esc(r.f)}</p><p class="small muted">${esc(r.c)}</p><div class="links">${refLinks(r)}<a href="#evidence" data-goref="${id}">Open in library</a></div>`;}
function placePop(t){const r=t.getBoundingClientRect();const pw=pop.offsetWidth,ph=pop.offsetHeight;let left=Math.min(Math.max(12,r.left+r.width/2-pw/2),window.innerWidth-pw-12);let top=r.bottom+8;if(top+ph>window.innerHeight-12)top=Math.max(12,r.top-ph-8);pop.style.left=left+"px";pop.style.top=top+"px";}
function openPop(t,html,label){pop.innerHTML=html;pop.setAttribute("aria-label",label||"Details");pop.hidden=false;popFor=t;t.setAttribute("aria-expanded","true");placePop(t);}
function closePop(){if(popFor)popFor.setAttribute("aria-expanded","false");pop.hidden=true;popFor=null;}
let pendingRef=null;
D.addEventListener("click",e=>{
  const go=e.target.closest("[data-goref]");if(go){pendingRef=go.dataset.goref;closePop();if(location.hash==="#evidence"){flashRef();e.preventDefault();}return;}
  const t=e.target.closest(".t"),c=e.target.closest(".cite");
  if(t){e.preventDefault();if(popFor===t){closePop();return;}const g=GLOSS[t.dataset.t];openPop(t,g?`<h4>${g[0]}</h4><p>${g[1]}</p>`:`<p>${esc(t.textContent)}</p>`,g?g[0]:"Meaning");return;}
  if(c){e.preventDefault();if(popFor===c){closePop();return;}openPop(c,refPop(c.dataset.r),"Source: "+(REFS[c.dataset.r]||{}).s);return;}
  if(popFor&&!pop.contains(e.target))closePop();
});
D.addEventListener("keydown",e=>{if(e.key==="Escape"&&popFor){const f=popFor;closePop();f.focus();}});
window.addEventListener("resize",()=>{if(popFor)placePop(popFor);});
window.addEventListener("scroll",()=>{if(popFor)placePop(popFor);},{passive:true});

/* ---------- Theme and text size ---------- */
let theme=store.get("theme","");
function applyTheme(){if(theme==="light"||theme==="dark")R.setAttribute("data-theme",theme);else R.removeAttribute("data-theme");$$("[data-themeset]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.themeset===(theme||"auto")?"true":"false"));}
applyTheme();
let size=store.get("size","");
function applySize(){if(size)R.setAttribute("data-size",size);else R.removeAttribute("data-size");$$("[data-sizeset]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sizeset===size?"true":"false"));}
applySize();
const themeHooks=[];function onTheme(f){themeHooks.push(f);}function runThemeHooks(){themeHooks.forEach(f=>{try{f();}catch(e){console.error(e);}});}
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",runThemeHooks);}catch(e){}

/* ---------- Toast and copy ---------- */
let toastT=0;function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},2400);}
function copyText(text,fallbackEl){
  const fail=()=>{if(fallbackEl){fallbackEl.value=text;fallbackEl.hidden=false;fallbackEl.focus();fallbackEl.select();toast("Select the text below and copy it");}else toast("Copy isn't available here");};
  try{navigator.clipboard.writeText(text).then(()=>toast("Copied"),fail);}catch(e){fail();}
}
D.addEventListener("click",e=>{const b=e.target.closest("[data-copy]");if(b)copyText(b.dataset.copy);});
const canPrint=(()=>{try{return window.self===window.top;}catch(e){return false;}})();
$$("[data-print]").forEach(b=>{b.hidden=!canPrint;b.addEventListener("click",()=>{$$(".view.on details").forEach(d=>{if(!d.open){d.open=true;d.dataset.reclose="1";}});window.print();});});
window.addEventListener("afterprint",()=>{$$("details[data-reclose]").forEach(d=>{d.open=false;delete d.dataset.reclose;});});

/* ---------- Motion: flowing or still, and always still if the device asks ---------- */
const reduceMQ=matchMedia("(prefers-reduced-motion: reduce)");
function motionOK(){if(store.get("motion","flow")==="still")return false;try{return !reduceMQ.matches;}catch(e){return true;}}
const motionHooks=[];function onMotion(f){motionHooks.push(f);}
function setMotion(){R.classList.toggle("motion",motionOK());motionHooks.forEach(f=>{try{f();}catch(e){console.error(e);}});}
try{reduceMQ.addEventListener("change",setMotion);}catch(e){}

/* ---------- Plays only while on screen (diagrams, figures, hero) ---------- */
function whenVisible(el,cb){if(!el)return;if(!("IntersectionObserver" in window)){cb(true);return;}new IntersectionObserver(es=>{cb(es[es.length-1].isIntersecting);},{threshold:.08}).observe(el);}

/* ---------- Evidence library ---------- */
let refTopic="all";
function initLibrary(){
  $("#refTopics").innerHTML=Object.keys(TOPICS).map(k=>`<button type="button" class="chip" data-topic="${k}" aria-pressed="${k==="all"}">${TOPICS[k]}</button>`).join("");
  $("#refList").innerHTML=Object.keys(REFS).map(id=>{const r=REFS[id];return `<article class="ref" id="ref-${id}" data-topic="${r.t}" data-text="${esc((r.s+" "+r.c+" "+r.f+" "+r.pop+" "+(TOPICS[r.t]||"")).toLowerCase())}"><div class="meta"><span>${TOPICS[r.t]||""}</span><span>${esc(r.k)}</span>${r.g?`<span class="g ${GRADE[r.g][0]}">${GRADE[r.g][1]}</span>`:""}</div><h4>${esc(r.s)}</h4><p>${esc(r.f)}</p><p class="small muted"><strong>Who:</strong> ${esc(r.pop)}</p><p class="small">${esc(r.c)}</p><div class="meta">${refLinks(r)}</div></article>`;}).join("");
  $("#refTopics").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(!b)return;refTopic=b.dataset.topic;$$("#refTopics .chip").forEach(c=>c.setAttribute("aria-pressed",c===b?"true":"false"));filterRefs();});
  $("#refQ").addEventListener("input",filterRefs);filterRefs();
}
function filterRefs(){const q=$("#refQ").value.trim().toLowerCase();let n=0;$$("#refList .ref").forEach(a=>{const ok=(refTopic==="all"||a.dataset.topic===refTopic)&&(!q||q.split(/\s+/).every(w=>a.dataset.text.includes(w)));a.hidden=!ok;if(ok)n++;});$("#refCount").textContent=n+" of "+Object.keys(REFS).length+" sources";}
function flashRef(){if(!pendingRef)return;const el=D.getElementById("ref-"+pendingRef);pendingRef=null;if(!el)return;refTopic="all";$("#refQ").value="";$$("#refTopics .chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.topic==="all"?"true":"false"));filterRefs();setTimeout(()=>{el.scrollIntoView({block:"center",behavior:motionOK()?"smooth":"auto"});el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");},60);}

/* ---------- Router ---------- */
const views=$$(".view"),ids=views.map(v=>v.dataset.view);
const viewHooks={};function onView(id,f){(viewHooks[id]=viewHooks[id]||[]).push(f);}
const leaveHooks=[];function onLeave(f){leaveHooks.push(f);}
let current=null;
function show(id,focus){if(!ids.includes(id))id="start";
  if(current&&current!==id)leaveHooks.forEach(f=>{try{f(current,id);}catch(e){console.error(e);}});
  views.forEach(v=>v.classList.toggle("on",v.dataset.view===id));$$(".thread a").forEach(a=>{if(a.dataset.id===id)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});closePop();
  $$("dialog[open]").forEach(d=>{try{d.close();}catch(e){}});
  window.scrollTo(0,0);current=id;
  const vt=NAV.find(n=>n.id===id);D.title=(vt&&id!=="start"?vt.l+" · ":"")+"Hale";
  if(focus){const h=$(".view.on h1, .view.on h2");if(h){h.setAttribute("tabindex","-1");h.focus({preventScroll:true});}}
  if(id==="evidence")flashRef();
  afterShow(id);}
function route(f){show((location.hash||"").replace("#","")||"start",f);}
window.addEventListener("hashchange",()=>route(true));
$("#menuBtn").addEventListener("click",()=>{const d=$("#navDlg");if(d.showModal)d.showModal();else d.setAttribute("open","");requestAnimationFrame(threadProg);});
$("#navDlg").addEventListener("click",e=>{if(e.target.closest("a"))$("#navDlg").close();});
$("#searchToggle").addEventListener("click",()=>{const s=$("#searchBox");s.classList.toggle("open");$("#searchToggle").setAttribute("aria-expanded",s.classList.contains("open")?"true":"false");if(s.classList.contains("open"))$("#q").focus();});
D.addEventListener("click",e=>{const c=e.target.closest("dialog [data-close]");if(c){const d=c.closest("dialog");if(d)d.close();}});

/* ---------- Search ---------- */
const IDX=[];const extraIndex=[];function addToIndex(f){extraIndex.push(f);}
function buildIndex(){IDX.length=0;
  views.forEach(v=>{const vid=v.dataset.view,vl=(NAV.find(n=>n.id===vid)||{}).l||"";
    $$("h1,h2,h3,h4,p,li,.s-title,dt,dd,td,figcaption",v).forEach(el=>{
      if(el.closest(".pager,#refList,.no-index,svg"))return;
      if(/^(P|LI|DD|TD)$/.test(el.tagName)&&el.querySelector("p,li,ul,ol,dl,table"))return;
      const txt=el.textContent.replace(/\s+/g," ").trim();if(txt.length<3)return;
      IDX.push({k:"el",v:vid,vl,el,t:txt,low:txt.toLowerCase(),h:/^H[1-4]$/.test(el.tagName)||el.classList.contains("s-title")});});});
  extraIndex.forEach(f=>{try{f(IDX);}catch(e){console.error(e);}});
  Object.keys(REFS).forEach(id=>{const r=REFS[id];IDX.push({k:"ref",id,vl:"Evidence library",t:r.s+": "+r.f,low:(r.s+" "+r.c+" "+r.f).toLowerCase(),h:false});});}
function snippet(t,words){const low=t.toLowerCase();let i=low.indexOf(words[0]);if(i<0)i=0;let s=Math.max(0,i-50),e=Math.min(t.length,i+110);let out=(s>0?"…":"")+t.slice(s,e)+(e<t.length?"…":"");out=esc(out);words.forEach(w=>{if(w.length<2)return;out=out.replace(new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"),"<mark>$1</mark>");});return out;}
let hits=[],sel=-1;const qEl=$("#q"),qRes=$("#qres");
function runSearch(){const q=qEl.value.trim().toLowerCase();if(q.length<2){qRes.hidden=true;qEl.setAttribute("aria-expanded","false");return;}
  const words=q.split(/\s+/).filter(Boolean);
  hits=IDX.filter(x=>words.every(w=>x.low.includes(w))).map(x=>({x,sc:(x.h?3:0)+(x.low.startsWith(words[0])?2:0)+(x.k!=="el"?1:0)-x.t.length/600})).sort((a,b)=>b.sc-a.sc).slice(0,9).map(o=>o.x);
  sel=-1;qEl.removeAttribute("aria-activedescendant");qRes.innerHTML=hits.length?hits.map((h,i)=>`<button type="button" role="option" id="qr-${i}" data-i="${i}" aria-selected="false"><span class="rv">${esc(h.vl)}</span><span class="rs">${snippet(h.t,words)}</span></button>`).join(""):`<p class="empty">No matches. Try a simpler word, such as "protein", "squat" or "bone".</p>`;
  qRes.hidden=false;qEl.setAttribute("aria-expanded","true");}
function openHit(h){qRes.hidden=true;qEl.setAttribute("aria-expanded","false");$("#searchBox").classList.remove("open");
  if(h.k==="ref"){pendingRef=h.id;if(location.hash==="#evidence")flashRef();else location.hash="evidence";return;}
  if(h.k==="fn"){h.go();return;}
  if(location.hash!=="#"+h.v)location.hash=h.v;
  setTimeout(()=>{let d=h.el.closest("details");while(d){d.open=true;d=d.parentElement&&d.parentElement.closest("details");}
    h.el.scrollIntoView({block:"center",behavior:motionOK()?"smooth":"auto"});h.el.classList.remove("flash-t");void h.el.offsetWidth;h.el.classList.add("flash-t");},90);}
qEl.addEventListener("input",runSearch);qEl.addEventListener("focus",()=>{if(qEl.value.trim().length>1)runSearch();});
qEl.addEventListener("keydown",e=>{const btns=$$("button",qRes);if(e.key==="ArrowDown"||e.key==="ArrowUp"){if(!btns.length)return;e.preventDefault();sel=(sel+(e.key==="ArrowDown"?1:-1)+btns.length)%btns.length;btns.forEach((b,i)=>b.setAttribute("aria-selected",i===sel?"true":"false"));qEl.setAttribute("aria-activedescendant","qr-"+sel);btns[sel].scrollIntoView({block:"nearest"});}
  else if(e.key==="Enter"){e.preventDefault();if(hits.length)openHit(hits[sel<0?0:sel]);}
  else if(e.key==="Escape"){qRes.hidden=true;qEl.setAttribute("aria-expanded","false");}});
qRes.addEventListener("click",e=>{const b=e.target.closest("[data-i]");if(b)openHit(hits[+b.dataset.i]);});
D.addEventListener("click",e=>{if(!e.target.closest("#searchBox")&&!e.target.closest("#searchToggle")){qRes.hidden=true;qEl.setAttribute("aria-expanded","false");}});

/* ---------- Where you live: services and emergency numbers ---------- */
const REGIONS={
au:{n:"Australia",em:"000",groups:[
 {t:"Health advice and your GP",items:[
  {o:"Your GP",d:"Start here for a check-up before stepping up exercise, for bone density and menopause questions, and for a referral. Since 1 July 2025, if you have a chronic condition with complex care needs, a GP chronic condition management plan can give Medicare rebates for up to 5 allied health visits a calendar year, with an exercise physiologist, physiotherapist, dietitian and others.",u:"https://www.servicesaustralia.gov.au/services-available-under-gp-chronic-condition-management-plan",who:"Medical"},
  {o:"healthdirect",d:"Free health advice from a registered nurse, any time. Called NURSE-ON-CALL in Victoria.",ph:"1800 022 222",h:"24 hours, 7 days",u:"https://www.healthdirect.gov.au",who:"Phone advice"}]},
 {t:"Exercise and movement",items:[
  {o:"Accredited Exercise Physiologist",d:"Tailored, supervised strength training, including for osteoporosis, arthritis, diabetes and heart conditions. Search by postcode on the ESSA site.",u:"https://www.essa.org.au/Maps",who:"Find a professional"},
  {o:"Physiotherapist, including pelvic health",d:"For pain, injury and pelvic floor problems. You don't need a doctor's referral. The Australian Physiotherapy Association's Choose Physio site has a find-a-physio search.",u:"https://choose.physio",who:"Find a professional"}]},
 {t:"Bones, pelvic floor, menopause and food",items:[
  {o:"Healthy Bones Australia",d:"Information on osteoporosis, bone density, calcium, vitamin D and exercise.",ph:"1800 242 141",h:"Monday to Thursday, 9.30 am to 2 pm AEST",u:"https://healthybonesaustralia.org.au",who:"Bones"},
  {o:"National Continence Helpline",d:"Free, confidential advice from nurse continence specialists on leaking, prolapse and pelvic floor health. Run by Continence Health Australia.",ph:"1800 33 00 66",h:"Monday to Friday, 8 am to 8 pm AEST",u:"https://www.continence.org.au",who:"Pelvic floor"},
  {o:"Australasian Menopause Society",d:"Find a doctor or health professional with a special interest in menopause.",u:"https://www.menopause.org.au/find-a-practitioner/",who:"Menopause"},
  {o:"Jean Hailes for Women's Health",d:"Plain-language information on menopause, bones, pelvic floor and healthy ageing.",u:"https://www.jeanhailes.org.au",who:"Women's health"},
  {o:"Accredited Practising Dietitian",d:"Help with protein, weight loss that protects muscle, and eating on GLP-1 medicines. Search on the Dietitians Australia site.",u:"https://dietitiansaustralia.org.au/find-dietitian",who:"Find a professional"}]}]},
nz:{n:"New Zealand",em:"111",groups:[
 {t:"Health advice",items:[
  {o:"Your GP",d:"Start here for a check-up before stepping up exercise, and for bone density, menopause and referral questions.",who:"Medical"},
  {o:"Healthline",d:"Free health advice from nurses and other clinicians. Interpreters are available.",ph:"0800 611 116",h:"24 hours, 7 days",u:"https://info.health.nz/contact-us",who:"Phone advice"}]},
 {t:"Bones and menopause",items:[
  {o:"Osteoporosis New Zealand",d:"Fact sheets on bone health, bone density scans, calcium and vitamin D, and avoiding broken bones.",u:"https://osteoporosis.org.nz",who:"Bones"},
  {o:"Australasian Menopause Society",d:"Its practitioner directory covers New Zealand as well as Australia.",u:"https://www.menopause.org.au/find-a-practitioner/",who:"Menopause"}]}]},
uk:{n:"United Kingdom",em:"999",groups:[
 {t:"Health advice",items:[
  {o:"Your GP",d:"Start here for a check-up before stepping up exercise, and for bone density, menopause and referral questions.",who:"Medical"},
  {o:"NHS 111",d:"Urgent medical help and advice when it isn't an emergency.",ph:"111",h:"24 hours, 7 days",u:"https://111.nhs.uk",who:"Phone advice"}]},
 {t:"Bones",items:[
  {o:"Royal Osteoporosis Society",d:"Free helpline staffed by nurses with specialist knowledge of osteoporosis and bone health. Free from UK landlines and mobiles.",ph:"0808 800 0035",h:"Weekdays. Check the website for current hours.",u:"https://theros.org.uk",who:"Bones"}]}]},
us:{n:"United States",em:"911",groups:[
 {t:"Health advice",items:[
  {o:"Your primary care clinician",d:"Start here for a check-up before stepping up exercise, and for bone density, menopause and referral questions.",who:"Medical"}]},
 {t:"Menopause",items:[
  {o:"The Menopause Society",d:"Formerly the North American Menopause Society. Its directory lists clinicians, including those with its certified practitioner credential.",u:"https://menopause.org",who:"Menopause"}]}]},
other:{n:"Elsewhere",em:"",groups:[
 {t:"Where to start",items:[
  {o:"Your family doctor",d:"Ask about a check-up before stepping up exercise, a bone density test if you have risk factors, and whether your health system funds an exercise professional, physiotherapist or dietitian.",who:"Medical"},
  {o:"Local emergency number",d:"Use your local emergency number for chest pain, sudden breathlessness, fainting or signs of a stroke.",who:"Emergency"}]}]}
};
const RORDER=["au","nz","uk","us","other"];
function guessRegion(){let tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){}
  if(/^Australia\//.test(tz))return"au";if(/^Pacific\/(Auckland|Chatham)/.test(tz))return"nz";if(/^Europe\/(London|Belfast)|^Europe\/Isle_of_Man|^Europe\/Jersey|^Europe\/Guernsey/.test(tz))return"uk";
  if(/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana|Kentucky|North_Dakota|Menominee|Adak|Juneau|Sitka|Metlakatla|Yakutat|Nome)|^Pacific\/Honolulu/.test(tz))return"us";
  return tz?"other":"au";}
let region=store.get("region",null);const regionChosen=!!(region&&REGIONS[region]);if(!regionChosen)region=guessRegion();
function svcCard(s){let host="";if(s.u){try{host=new URL(s.u).hostname.replace(/^www\./,"");}catch(e){host=s.u;}}
  return `<div class="card svc">${s.who?`<span class="who">${s.who}</span>`:""}<h3>${s.o}</h3><p class="muted">${s.d}</p>${s.ph?`<p><strong class="phone">${s.ph}</strong> <button type="button" class="mini" data-copy="${s.ph}" aria-label="Copy ${s.o} number">Copy</button></p>`:""}${s.h?`<p class="hrs">${s.h}</p>`:""}${s.u?`<p class="lnk"><a href="${s.u}" target="_blank" rel="noopener">${host}</a></p>`:""}</div>`;}
function renderRegion(){const g=REGIONS[region]||REGIONS.au;
  $$("[data-region-chips]").forEach(c=>{c.innerHTML=RORDER.map(k=>`<button type="button" class="chip" data-region="${k}" aria-pressed="${k===region}">${REGIONS[k].n}</button>`).join("");});
  $$("[data-em]").forEach(el=>el.textContent=g.em?g.em:"your local emergency number");
  $$("[data-region-name]").forEach(el=>el.textContent=g.n);
  const hint=$("#regionHint");if(hint)hint.textContent=regionChosen||store.get("region",null)?"":"Chosen from your device's time zone. Pick another place if it's wrong.";
  const L=$("#svcList");if(L){L.innerHTML=g.groups.map(gr=>`<section class="stack"><h3>${gr.t}</h3><div class="grid">${gr.items.map(s=>svcCard(s)).join("")}</div></section>`).join("");L.classList.remove("swap");void L.offsetWidth;L.classList.add("swap");}
}
D.addEventListener("click",e=>{const b=e.target.closest("[data-region]");if(!b)return;region=b.dataset.region;store.set("region",region);renderRegion();buildIndex();toast("Showing services for "+REGIONS[region].n);});

/* ---------- Sections explored, and where you were ---------- */
let seen=new Set(store.get("seen",[]));
function updSeen(cur){$$(".thread a").forEach(a=>a.classList.toggle("seen",seen.has(a.dataset.id)&&a.dataset.id!==cur));
  const n=NAV.filter(x=>seen.has(x.id)).length,t=NAV.length,v=$("#exVal");
  if(v){const c=2*Math.PI*16;v.style.strokeDasharray=c.toFixed(2);v.style.strokeDashoffset=(c*(1-n/t)).toFixed(2);}
  const tx=$("#exTxt");if(tx)tx.textContent="Explored "+n+" of "+t;}
function markSeen(id){if(!seen.has(id)){seen.add(id);store.set("seen",[...seen]);}if(id!=="start")store.set("last",id);updSeen(id);}
function renderResume(){const box=$("#resume");if(!box)return;const last=store.get("last",null),nv=NAV.find(n=>n.id===last);
  if(!nv||seen.size<3){box.hidden=true;return;}$("#resumeName").textContent=nv.l;$("#resumeBtn").setAttribute("href","#"+nv.id);box.hidden=false;}
function threadProg(){["thread","threadM"].forEach(id=>{const th=D.getElementById(id);if(!th)return;const a=th.querySelector('a[aria-current="page"]');th.style.setProperty("--prog",a?Math.max(0,a.offsetTop+2)+"px":"0px");});}

/* ---------- Reading progress ---------- */
const rpBar=$("#readProg");let rafS=0;const topEl=$(".top");
function onScroll(){rafS=0;if(topEl)topEl.classList.toggle("compact",scrollY>30);const h=D.documentElement.scrollHeight-innerHeight;if(rpBar)rpBar.style.transform="scaleX("+(h>0?Math.min(1,Math.max(0,scrollY/h)):0).toFixed(4)+")";}
addEventListener("scroll",()=>{if(!rafS)rafS=requestAnimationFrame(onScroll);},{passive:true});
addEventListener("resize",()=>{threadProg();onScroll();});

/* ---------- Entrances: each chapter settles into place; content rises as you reach it ---------- */
function enterView(v){if(!motionOK()||!v)return;v.classList.remove("entering");void v.offsetWidth;[...v.children].forEach((c,i)=>c.style.setProperty("--i",Math.min(i,7)));v.classList.add("entering");clearTimeout(v._et);v._et=setTimeout(()=>v.classList.remove("entering"),1700);}
const REVEAL=".grid>*,.paths>*,.stats>*,.triage>*,.svg-box,.tbl-wrap,.truths>li,.grades>*,.out,.accs>details,.ex-grid>*";
let io=null;
function setupReveal(){if(!motionOK()||!("IntersectionObserver" in window))return;
  io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);el.classList.add("in");setTimeout(()=>{el.classList.remove("rv","in");el.style.removeProperty("--rd");},1500);}),{rootMargin:"0px 0px -5% 0px",threshold:.05});
  $$(REVEAL).forEach(el=>{if(el.closest("dialog,#refList,#svcList,.hero")||el.classList.contains("rv"))return;const p=el.parentElement,k=p?[...p.children].indexOf(el):0;el.style.setProperty("--rd",Math.min(k,6)*70+"ms");el.classList.add("rv");io.observe(el);});}
onMotion(()=>{if(!motionOK()){$$(".rv").forEach(el=>{el.classList.remove("rv","in");});}});
function splitHero(){const h=$("#h-start");if(!h||h.dataset.split)return;h.dataset.split="1";let d=0;
  [...h.childNodes].forEach(n=>{if(n.nodeType===3){const f=D.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(D.createTextNode(p));return;}const s=D.createElement("span");s.className="w";s.style.setProperty("--d",d++);s.textContent=p;f.appendChild(s);});n.replaceWith(f);}else if(n.nodeType===1){n.style.setProperty("--d",d++);}});}

/* ---------- Accordions open and close smoothly ---------- */
D.addEventListener("click",e=>{const sm=e.target.closest("details.acc>summary");if(!sm||!motionOK())return;const d=sm.parentElement,b=d.querySelector(":scope>.acc-body");if(!b)return;e.preventDefault();if(d._anim)return;
  if(d.open){const h=b.offsetHeight;d.classList.add("closing");b.style.overflow="hidden";d._anim=b.animate([{height:h+"px",opacity:1},{height:"0px",opacity:0}],{duration:300,easing:"cubic-bezier(.4,0,.2,1)"});d._anim.onfinish=()=>{d.open=false;d.classList.remove("closing");b.style.overflow="";d._anim=null;};}
  else{d.open=true;const h=b.offsetHeight;b.style.overflow="hidden";d._anim=b.animate([{height:"0px",opacity:0},{height:h+"px",opacity:1}],{duration:400,easing:"cubic-bezier(.2,.7,.2,1)"});d._anim.onfinish=()=>{b.style.overflow="";d._anim=null;};}});

/* ---------- A soft light follows the pointer across cards ---------- */
D.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest("a.card,button.card,.path,.lift");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--mx",Math.round(e.clientX-r.left)+"px");c.style.setProperty("--my",Math.round(e.clientY-r.top)+"px");},{passive:true});

/* ---------- A small celebration for finished steps ---------- */
function burst(el){if(!motionOK()||!el)return;const r=el.getBoundingClientRect(),b=D.createElement("div");b.className="burst";b.style.left=(r.left+r.width/2)+"px";b.style.top=(r.top+r.height/2)+"px";const cs=["var(--haem)","var(--eosin)","var(--violet)","var(--sage)"];
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2,d=38+Math.random()*34,s=D.createElement("i");s.style.background=cs[i%4];s.style.setProperty("--x",(Math.cos(a)*d).toFixed(1)+"px");s.style.setProperty("--y",(Math.sin(a)*d).toFixed(1)+"px");b.appendChild(s);}
  D.body.appendChild(b);setTimeout(()=>b.remove(),1000);}

/* ---------- After each chapter is shown ---------- */
function afterShow(id){const v=D.getElementById("v-"+id);markSeen(id);threadProg();enterView(v);onScroll();if(id==="start")renderResume();
  (viewHooks[id]||[]).forEach(f=>{try{f();}catch(e){console.error(e);}});
  try{D.dispatchEvent(new CustomEvent("hale:rendered",{detail:{view:id}}));}catch(e){}}

/* ---------- Palettes and the display studio ---------- */
const PALS=[{"id":"vellum","name":"Linen","note":"Warm paper, forest green and ochre.","dots":["#2F5E4B","#B07A2E","#F6F1E7"]},{"id":"lagoon","name":"Sea glass","note":"Teal and coral. Calm and clear.","dots":["#17676A","#E07A5F","#F1F6F5"]},{"id":"peony","name":"Peony","note":"Blush paper, deep rose and sage.","dots":["#A23D58","#6E9174","#FBF3F2"]},{"id":"nocturne","name":"Twilight","note":"Midnight blue and moonlight lilac.","dots":["#2D4C9A","#8A6CC9","#F2F4FA"]},{"id":"graphite","name":"Graphite","note":"Quiet greys with a petrol accent.","dots":["#155E66","#C77A3A","#F2F4F5"]},{"id":"slide","name":"Iris","note":"Indigo and rose on violet-white.","dots":["#3D48A0","#C4577D","#F6F4FA"]}];
let palette=store.get("palette","vellum");if(!PALS.some(p=>p.id===palette))palette="vellum";
const studio=$("#studio"),sBtn=$("#studioBtn");
function applyPalette(){R.setAttribute("data-palette",palette);$$("#pals [data-pal]").forEach(b=>{const on=b.dataset.pal===palette;b.setAttribute("aria-checked",on?"true":"false");b.tabIndex=on?0:-1;});}
function applyMotionUI(){const m=store.get("motion","flow");$$("[data-motionset]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.motionset===m?"true":"false"));}
function setPalette(id){if(id===palette)return;const go=()=>{palette=id;store.set("palette",id);applyPalette();};
  if(D.startViewTransition&&motionOK()){try{const t=D.startViewTransition(go);t.finished.then(runThemeHooks,runThemeHooks);}catch(e){go();runThemeHooks();}}else{go();runThemeHooks();}
  const p=PALS.find(x=>x.id===id);if(p)toast("Palette: "+p.name);}
function setTheme(next,el){if(next===theme){applyTheme();return;}const apply=()=>{theme=next;store.set("theme",theme);applyTheme();};
  const b=(el||sBtn).getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;
  if(D.startViewTransition&&motionOK()){try{const t=D.startViewTransition(apply);
      t.ready.then(()=>{const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));R.animate({clipPath:["circle(0px at "+x+"px "+y+"px)","circle("+r+"px at "+x+"px "+y+"px)"]},{duration:720,easing:"cubic-bezier(.2,.7,.2,1)",pseudoElement:"::view-transition-new(root)"});}).catch(()=>{});
      t.finished.then(runThemeHooks,runThemeHooks);}catch(e){apply();runThemeHooks();}}
  else{apply();runThemeHooks();}
  toast(next?("Theme: "+next):"Theme: matches your device");}
function renderStudio(){$("#pals").innerHTML=PALS.map(p=>`<button type="button" class="pal" role="radio" data-pal="${p.id}" aria-checked="false" tabindex="-1"><span class="dots" aria-hidden="true">${p.dots.map(c=>`<i style="background:${c}"></i>`).join("")}</span><span class="pn"><b>${p.name}</b><small>${p.note}</small></span></button>`).join("");
  applyPalette();applyTheme();applySize();applyMotionUI();}
function placeStudio(){if(innerWidth<=480){studio.style.top="";studio.style.right="";return;}const r=sBtn.getBoundingClientRect();studio.style.top=Math.round(r.bottom+10)+"px";studio.style.right=Math.max(12,Math.round(innerWidth-r.right))+"px";}
addEventListener("resize",()=>{if(!studio.hidden)placeStudio();});
let studioOpener=null;
function openStudio(from){studioOpener=from||sBtn;placeStudio();studio.hidden=false;sBtn.setAttribute("aria-expanded","true");const c=$('#pals [aria-checked="true"]');if(c)c.focus({preventScroll:true});}
function closeStudio(f){if(studio.hidden)return;studio.hidden=true;sBtn.setAttribute("aria-expanded","false");if(f){const o=(studioOpener&&studioOpener.offsetParent)?studioOpener:(sBtn.offsetParent?sBtn:$("#menuBtn"));if(o)o.focus();}}
sBtn.addEventListener("click",e=>{e.stopPropagation();if(studio.hidden)openStudio(sBtn);else closeStudio();});
D.addEventListener("click",e=>{if(studio.hidden)return;if(!e.target.closest("#studio,#studioBtn,[data-open-studio]"))closeStudio();});
D.addEventListener("keydown",e=>{if(e.key==="Escape"&&!studio.hidden)closeStudio(true);});
studio.addEventListener("click",e=>{const p=e.target.closest("[data-pal]");if(p){setPalette(p.dataset.pal);return;}
  const t=e.target.closest("[data-themeset]");if(t){setTheme(t.dataset.themeset==="auto"?"":t.dataset.themeset,t);return;}
  const s=e.target.closest("[data-sizeset]");if(s){size=s.dataset.sizeset;store.set("size",size);applySize();runThemeHooks();return;}
  const m=e.target.closest("[data-motionset]");if(m){store.set("motion",m.dataset.motionset);setMotion();applyMotionUI();toast(m.dataset.motionset==="still"?"Motion: still":"Motion: flowing");}});
$("#pals").addEventListener("keydown",e=>{const k=e.key;if(!["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"].includes(k))return;e.preventDefault();
  const i=PALS.findIndex(p=>p.id===palette),n=PALS.length,j=(i+((k==="ArrowDown"||k==="ArrowRight")?1:-1)+n)%n;setPalette(PALS[j].id);const b=$(`#pals [data-pal="${PALS[j].id}"]`);if(b)b.focus();});
D.addEventListener("click",e=>{const o=e.target.closest("[data-open-studio]");if(!o)return;const nd=$("#navDlg");if(nd.open)nd.close();setTimeout(()=>openStudio($("#menuBtn").offsetParent?$("#menuBtn"):o),60);});

/* ---------- Your data: download or clear everything this guide stored ---------- */
function allData(){const out={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PFX))out[k.slice(PFX.length)]=JSON.parse(localStorage.getItem(k));}}catch(e){}return out;}
D.addEventListener("click",e=>{
  const dl=e.target.closest("[data-download-data]");if(dl){const blob=new Blob([JSON.stringify({app:"Hale",saved:new Date().toISOString(),data:allData()},null,2)],{type:"application/json"});const a=D.createElement("a");a.href=URL.createObjectURL(blob);a.download="hale-my-data-"+todayISO()+".json";D.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);toast("Downloading your data");return;}
  const cl=e.target.closest("[data-clear-data]");if(cl){if(cl.dataset.armed!=="1"){cl.dataset.armed="1";cl.textContent="Tap again to delete everything";cl.classList.add("armed");clearTimeout(cl._t);cl._t=setTimeout(()=>{cl.dataset.armed="";cl.textContent="Clear all my data";cl.classList.remove("armed");},5000);return;}
    try{Object.keys(allData()).forEach(k=>localStorage.removeItem(PFX+k));}catch(e){}toast("All saved data cleared");setTimeout(()=>location.reload(),700);}
});
