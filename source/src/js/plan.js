/* ---------- My programme: a plan from three answers, a session log and progress ---------- */
const PB_DEF={exp:"",days:"",eq:"",cons:{}};
let pb=Object.assign({},PB_DEF,store.get("plan",{}));pb.cons=pb.cons||{};
const MAIN=new Set(["sts","goblet","bridge","rdl","stepup","split","pushup","press","row","bandrow"]);
function pickFor(slot){const eq=pb.eq,c=pb.cons;
  switch(slot){
    case "squat":return (eq==="body"||c.knee)?"sts":"goblet";
    case "hinge":return (eq==="body"||c.back)?"bridge":"rdl";
    case "push":return "pushup";
    case "press":return c.shoulder?"pushup":"press";
    case "pull":return eq==="body"?"bandrow":"row";
    case "single":return "stepup";
    case "split":return c.knee?"stepup":"split";
    case "carry":return "carry";case "calf":return "calf";case "core":return "deadbug";case "balance":return "balance";}}
function dayPlan(day){const A=["squat","push","hinge","pull","single","carry","balance"],B=["hinge","press","split","pull","calf","core","balance"];
  const seen=new Set();return (day==="A"?A:B).map(pickFor).filter(id=>{if(seen.has(id))return false;seen.add(id);return true;});}
function dose(id){const e=pb.exp;
  if(id==="balance")return {sets:e==="new"?"2":"3",reps:"20 to 30 s each side",rir:"",rest:"as needed"};
  if(id==="carry")return {sets:e==="new"?"2":"3",reps:"20 to 40 m",rir:"",rest:"1 min"};
  if(id==="deadbug")return {sets:e==="new"?"1 to 2":"2",reps:"6 to 10 each side",rir:"",rest:"1 min"};
  if(id==="calf")return {sets:e==="new"?"1 to 2":e==="back"?"2":"3",reps:"12 to 15",rir:"2 to 3",rest:"1 min"};
  if(e==="new")return {sets:"1 to 2",reps:"10 to 12",rir:"3 or more",rest:"1 to 1.5 min"};
  if(e==="back")return {sets:"2",reps:"8 to 12",rir:"2 to 3",rest:"1 to 2 min"};
  return {sets:"3",reps:MAIN.has(id)?"6 to 10":"10 to 15",rir:"1 to 2",rest:MAIN.has(id)?"2 min":"1 min"};}
function nameFor(id){if(id==="press"&&pb.eq==="body")return "Seated shoulder press (band)";if(id==="pushup"&&pb.eq==="gym")return "Incline push-up or chest press";if(id==="goblet"&&pb.eq==="gym")return "Goblet squat or leg press";if(id==="row"&&pb.eq==="gym")return "One-arm row or seated cable row";if(id==="carry"&&pb.eq==="body")return "Farmer's carry (bags or bottles)";return EXBY[id].n;}
function planNotes(){const c=pb.cons,n=[];
  n.push(pb.exp==="new"?"Weeks 1 and 2: learn each movement with light loads and stop with 3 or more repetitions in reserve. From week 3, build to 2 sets of 8 to 12 with 2 or 3 in reserve.":pb.exp==="back"?"Use the first two weeks to find your working weights, then progress with double progression: add repetitions, then weight.":"Keep main lifts in the 6 to 10 range most weeks and add load when you reach the top of the range in every set. Include some heavier sets of 5 to 6 once technique is solid.");
  if(c.knee)n.push("Knee or hip pain: squat to a higher chair, use a low step, and work in a comfortable range. Mild discomfort that settles within a day is usually fine.");
  if(c.bone)n.push("Low bone density: keep your back long when you hinge and lift, include balance work every session, and build up to heavier loads with a physiotherapist or exercise physiologist.");
  if(c.pf)n.push("Pelvic floor: breathe out and gently lift your pelvic floor as you lift, start lighter, and see a pelvic health physiotherapist if you leak or feel heaviness.");
  if(c.shoulder)n.push("Shoulder pain: overhead pressing is swapped for a second push-up day. Use a higher incline and a pain-free range.");
  if(c.back)n.push("Low back pain: the glute bridge replaces the deadlift for now. Move to Romanian deadlifts with a light load once bridges feel easy.");
  return n;}
function planReady(){return pb.exp&&pb.days&&pb.eq;}
function rowHTML(id){const d=dose(id);return `<li class="pb-row"><span class="pb-fig" data-pfig="${id}"></span><span class="pb-info"><button type="button" class="pb-name" data-ex="${id}" aria-haspopup="dialog">${nameFor(id)}</button><span class="pb-dose">${d.sets} ${d.sets==="1"?"set":"sets"} × ${d.reps}${d.rir?` · ${d.rir} in reserve`:""}</span><span class="pb-rest">Rest ${d.rest}</span></span></li>`;}
function renderPlan(){
  $$("[data-pb]").forEach(g=>{const k=g.dataset.pb;$$("[data-v]",g).forEach(b=>{const on=String(pb[k])===b.dataset.v;b.setAttribute("aria-checked",on?"true":"false");b.tabIndex=on||(!pb[k]&&b===g.querySelector("[data-v]"))?0:-1;});});
  $$("[data-pbc]").forEach(cb=>cb.checked=!!pb.cons[cb.dataset.pbc]);
  const out=$("#pbOut");if(!out)return;dropFigs(out);
  if(!planReady()){out.innerHTML=`<p class="muted">Answer the three questions above and your plan will appear here.</p>`;renderLogger();return;}
  const sched=pb.days==="2"?"Do Day A and Day B each week, with at least a day between them.":"Train three days a week, alternating: A, B, A one week, then B, A, B the next, with a day between sessions.";
  out.innerHTML=`<div class="pb-head"><h4>Your plan</h4><p>${sched} Warm up for 5 minutes first: brisk walking or marching, then a light practice set.</p></div>
   <div class="pb-days">${["A","B"].map(d=>`<section class="pb-day"><h5>Day ${d}</h5><ol class="pb-list">${dayPlan(d).map(rowHTML).join("")}</ol></section>`).join("")}</div>
   <ul class="ticks small">${planNotes().map(x=>`<li>${x}</li>`).join("")}</ul>
   <div class="row no-print"><button type="button" class="btn sm" id="pbCopy">Copy as text</button><button type="button" class="btn sm" data-print-plan>Print</button></div>
   <textarea class="copybox" id="pbCopyBox" hidden aria-label="Plan as text"></textarea>`;
  $$("[data-pfig]",out).forEach(h=>makeFig(h,EXBY[h.dataset.pfig],{small:true}));
  const pr=out.querySelector("[data-print-plan]");pr.hidden=!canPrint;pr.addEventListener("click",()=>window.print());
  $("#pbCopy").addEventListener("click",()=>copyText(planText(),$("#pbCopyBox")));
  renderLogger();}
function planText(){return "My strength plan (Hale)\n"+(pb.days==="2"?"Day A and Day B each week.":"Alternate A, B, A then B, A, B.")+"\n\n"+["A","B"].map(d=>"Day "+d+"\n"+dayPlan(d).map(id=>{const x=dose(id);return "- "+nameFor(id)+": "+x.sets+" sets x "+x.reps+(x.rir?", "+x.rir+" in reserve":"")+", rest "+x.rest;}).join("\n")).join("\n\n")+"\n\nNotes:\n"+planNotes().map(x=>"- "+x).join("\n");}
D.addEventListener("click",e=>{const b=e.target.closest("[data-pb] [data-v]");if(!b)return;const k=b.closest("[data-pb]").dataset.pb;pb[k]=b.dataset.v;store.set("plan",pb);renderPlan();});
D.addEventListener("keydown",e=>{const b=e.target.closest&&e.target.closest("[data-pb] [data-v]");if(!b)return;const k=e.key;if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(k))return;e.preventDefault();const g=b.closest("[data-pb]"),bs=$$("[data-v]",g),i=bs.indexOf(b),j=(i+(k==="ArrowRight"||k==="ArrowDown"?1:-1)+bs.length)%bs.length;pb[g.dataset.pb]=bs[j].dataset.v;store.set("plan",pb);renderPlan();const nb=$$("[data-v]",$(`[data-pb="${g.dataset.pb}"]`))[j];if(nb)nb.focus();});
D.addEventListener("change",e=>{const cb=e.target.closest("[data-pbc]");if(!cb)return;pb.cons[cb.dataset.pbc]=cb.checked;store.set("plan",pb);renderPlan();});

/* Session log */
let logDay="A";
function sessions(){return store.get("log",[]);}
function nSets(){return pb.exp==="reg"?3:pb.exp==="back"?2:2;}
function loggable(id){return id!=="balance"&&id!=="deadbug";}
function renderLogger(){const f=$("#logForm");if(!f)return;
  if(!planReady()){f.innerHTML=`<p class="muted">Build your plan above first, then log each session here.</p>`;renderWeek();renderHistory();return;}
  const ids=dayPlan(logDay).filter(loggable),ns=nSets();
  f.innerHTML=`<div class="row log-top"><div class="chips" role="radiogroup" aria-label="Which day">${["A","B"].map(d=>`<button type="button" class="chip" role="radio" data-logday="${d}" aria-checked="${d===logDay}" tabindex="${d===logDay?0:-1}">Day ${d}</button>`).join("")}</div><label class="fld inline">Date <input type="date" id="logDate" value="${todayISO()}" max="${todayISO()}"></label></div>
   <div class="log-grid">${ids.map(id=>`<fieldset class="log-ex"><legend>${nameFor(id)}</legend>${Array.from({length:ns},(_,i)=>`<div class="log-set"><span class="ls-n">Set ${i+1}</span><label><span class="sr-only">${nameFor(id)} set ${i+1} weight in kilograms</span><input type="number" inputmode="decimal" min="0" max="500" step="0.5" data-lex="${id}" data-ls="${i}" data-lk="kg" placeholder="kg"></label><span class="x" aria-hidden="true">×</span><label><span class="sr-only">${nameFor(id)} set ${i+1} ${id==="carry"?"metres":"repetitions"}</span><input type="number" inputmode="numeric" min="0" max="500" step="1" data-lex="${id}" data-ls="${i}" data-lk="r" placeholder="${id==="carry"?"m":"reps"}"></label></div>`).join("")}</fieldset>`).join("")}</div>
   <div class="row"><button type="button" class="btn primary" id="logSave">Save session</button><span class="small muted" id="logMsg" aria-live="polite"></span></div>`;
  $("#logSave").addEventListener("click",saveSession);renderWeek();renderHistory();}
D.addEventListener("click",e=>{const b=e.target.closest("[data-logday]");if(!b)return;logDay=b.dataset.logday;renderLogger();const nb=$(`[data-logday="${logDay}"]`);if(nb)nb.focus();});
function saveSession(){const ex={};$$("[data-lex]").forEach(inp=>{const id=inp.dataset.lex,i=+inp.dataset.ls,k=inp.dataset.lk,v=inp.value.trim();if(v==="")return;const n=parseFloat(v);if(!isFinite(n)||n<0)return;(ex[id]=ex[id]||[]);ex[id][i]=Object.assign(ex[id][i]||{},{[k]:n});});
  Object.keys(ex).forEach(id=>{ex[id]=ex[id].filter(s=>s&&s.r>0).map(s=>({kg:s.kg||0,r:s.r}));if(!ex[id].length)delete ex[id];});
  const msg=$("#logMsg");if(!Object.keys(ex).length){msg.textContent="Enter repetitions for at least one set first.";return;}
  const date=($("#logDate").value||todayISO()).slice(0,10);const all=sessions();all.push({id:Date.now().toString(36),date,day:logDay,ex});all.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);store.set("log",all.slice(-400));
  msg.textContent="";toast("Session saved");burst($("#logSave"));logDay=logDay==="A"?"B":"A";renderLogger();}
function weekStart(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());const k=(x.getDay()+6)%7;x.setDate(x.getDate()-k);return x;}
function renderWeek(){const el=$("#weekPips");if(!el)return;const goal=+(pb.days||2);const ws=weekStart(new Date());const n=new Set(sessions().filter(s=>{const [y,m,d]=s.date.split("-").map(Number);return new Date(y,m-1,d)>=ws;}).map(s=>s.id)).size;
  el.innerHTML=`<span class="pips" aria-hidden="true">${Array.from({length:Math.max(goal,n)},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span><span>This week: ${n} of ${goal} sessions</span>`;}
function renderHistory(){const list=$("#sessList"),sel=$("#progEx");if(!list||!sel)return;const all=sessions();
  list.innerHTML=all.length?all.slice(-8).reverse().map(s=>{const k=Object.keys(s.ex),sets=k.reduce((a,id)=>a+s.ex[id].length,0);return `<li><span><b>${fmtDate(s.date)}</b> · Day ${s.day} · ${k.length} exercise${k.length===1?"":"s"}, ${sets} set${sets===1?"":"s"}</span><button type="button" class="mini" data-del-sess="${s.id}" aria-label="Delete session on ${fmtDate(s.date)}">Delete</button></li>`;}).join(""):`<li class="muted">No sessions yet.</li>`;
  const ids=[...new Set(all.flatMap(s=>Object.keys(s.ex)))].filter(id=>EXBY[id]);const cur=sel.value;
  sel.innerHTML=ids.length?ids.map(id=>`<option value="${id}">${EXBY[id].n}</option>`).join(""):`<option value="">No exercises logged yet</option>`;
  if(ids.includes(cur))sel.value=cur;progChart();}
function progChart(){const sel=$("#progEx"),id=sel&&sel.value;const all=sessions().filter(s=>id&&s.ex[id]);const note=$("#progNote");
  if(!id||!all.length){chartDef("chProg",{empty:"Log a session and your progress will show here."});if(note)note.textContent="";return;}
  const weighted=all.some(s=>s.ex[id].some(x=>x.kg>0));
  const pts=all.map(s=>{const sets=s.ex[id];if(weighted){const top=sets.reduce((a,b)=>b.kg>a.kg||(b.kg===a.kg&&b.r>a.r)?b:a,sets[0]);return {v:top.kg,extra:top.r+(id==="carry"?" m":" reps")+" at that weight"};}const best=Math.max(...sets.map(x=>x.r));return {v:best,extra:""};});
  chartDef("chProg",{type:"line",label:(weighted?"Heaviest weight lifted":"Most repetitions in a set")+" in "+EXBY[id].n+", by session",x:all.map(s=>fmtDate(s.date).replace(/ \d{4}$/,"")),xName:"Session date",series:[{name:weighted?"Heaviest weight (kg)":(id==="carry"?"Longest carry (m)":"Most reps in a set"),values:pts.map(p=>p.v)}],fmt:v=>weighted?v+" kg":String(v),tipExtra:i=>pts[i].extra,h:220});
  if(note)note.textContent=weighted?"Shows the heaviest weight you used in each session; hover or focus a point for the repetitions.":"Shows the most repetitions you did in one set in each session.";}
D.addEventListener("change",e=>{if(e.target.id==="progEx")progChart();});
D.addEventListener("click",e=>{const b=e.target.closest("[data-del-sess]");if(!b)return;if(b.dataset.armed!=="1"){b.dataset.armed="1";b.textContent="Tap again to delete";setTimeout(()=>{if(b.isConnected){b.dataset.armed="";b.textContent="Delete";}},4000);return;}
  store.set("log",sessions().filter(s=>s.id!==b.dataset.delSess));toast("Session deleted");renderHistory();renderWeek();});
onView("plan",()=>{renderPlan();});
