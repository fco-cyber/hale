/* ---------- Exercise library ---------- */
const PATS=["All","Legs","Hips","Push","Pull","Carry","Trunk","Balance"];
const EQS=[["any","Any equipment"],["body","Body weight and bands"],["db","Dumbbells"],["gym","Gym"]];
const EQNAME={body:"Body weight",db:"Dumbbells",gym:"Gym"};
let exPat="All",exEq="any";
function exCard(ex){return `<button type="button" class="card ex-card" data-ex="${ex.id}" aria-haspopup="dialog"><span class="ex-fig" data-fig="${ex.id}"></span><span class="ex-meta"><span class="tag">${ex.pat}</span>${ex.eq.map(e=>`<span class="tag soft">${EQNAME[e]}</span>`).join("")}</span><span class="ex-name">${ex.n}</span><span class="ex-one">${ex.one}</span><span class="go">How to do it <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>`;}
function renderLibrary(){const grid=$("#exGrid");if(!grid)return;
  $("#exPat").innerHTML=PATS.map(p=>`<button type="button" class="chip" data-pat="${p}" aria-pressed="${p===exPat}">${p}</button>`).join("");
  $("#exEq").innerHTML=EQS.map(([k,l])=>`<button type="button" class="chip" data-eqf="${k}" aria-pressed="${k===exEq}">${l}</button>`).join("");
  const list=EX.filter(e=>(exPat==="All"||e.pat===exPat)&&(exEq==="any"||e.eq.includes(exEq)));
  dropFigs(grid);grid.innerHTML=list.map(exCard).join("")||`<p class="muted">No exercises match. Try another filter.</p>`;
  $$("[data-fig]",grid).forEach(h=>makeFig(h,EXBY[h.dataset.fig],{small:true}));
  $("#exCount").textContent=list.length+" of "+EX.length+" exercises";}
D.addEventListener("click",e=>{const p=e.target.closest("[data-pat]");if(p){exPat=p.dataset.pat;renderLibrary();return;}
  const q=e.target.closest("[data-eqf]");if(q){exEq=q.dataset.eqf;renderLibrary();return;}
  const c=e.target.closest("[data-ex]");if(c){openEx(c.dataset.ex,c);}});
let exReturn=null;
function openEx(id,from){const ex=EXBY[id],dlg=$("#exDlg");if(!ex||!dlg)return;exReturn=from||null;
  $("#exDlgEyebrow").textContent=ex.pat;$("#exDlgTitle").textContent=ex.n;$("#exDlgTags").innerHTML=ex.eq.map(e=>`<span class="tag soft">${EQNAME[e]}</span>`).join("");
  const body=$("#exDlgBody");dropFigs(body);
  body.innerHTML=`<div class="ex-top"><div class="ex-big" id="exBig"></div><div class="ex-mm">${muscleMap(ex)}${muscleList(ex)}</div></div>
   <p class="ex-lead">${ex.one}</p>
   <section><h3>How to do it</h3><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol></section>
   <section><h3>Tips</h3><ul class="ticks">${ex.tips.map(s=>`<li>${s}</li>`).join("")}</ul></section>
   <div class="grid two-up"><div class="card"><span class="who">Easier</span><p>${ex.easier}</p></div><div class="card"><span class="who">Harder</span><p>${ex.harder}</p></div></div>
   <p class="small muted">Breathe out during the effort. Stop if you feel sharp pain, dizziness or chest discomfort. <a href="#safe">Starting safely</a></p>`;
  const f=makeFig($("#exBig"),ex,{animate:true});f.svg.setAttribute("aria-label",ex.n+": moving figure. "+ex.steps.join(" "));
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");setTimeout(figSync,30);}
$("#exDlg").addEventListener("close",()=>{dropFigs($("#exDlgBody"));if(exReturn&&exReturn.isConnected)exReturn.focus();exReturn=null;});
addToIndex(I=>EX.forEach(ex=>I.push({k:"fn",vl:"Exercise library",t:ex.n+": "+ex.one,low:(ex.n+" "+ex.one+" "+ex.steps.join(" ")+" "+ex.pat).toLowerCase(),h:true,go:()=>{if(location.hash!=="#moves")location.hash="moves";setTimeout(()=>openEx(ex.id),120);}})));
onView("moves",()=>{if(!$("#exGrid").children.length)renderLibrary();});
