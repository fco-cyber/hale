/* ---------- Pre-exercise check-in (APSS stage 1, paraphrased) ---------- */
const APSSQ=["Has a doctor ever told you that you have a heart condition, or have you ever had a stroke?","Do you ever have unexplained pain or discomfort in your chest, at rest or during physical activity?","Do you ever feel faint or dizzy, or lose your balance, during physical activity?","In the last 12 months, have you had an asthma attack that needed immediate medical attention?","If you have diabetes, have you had trouble controlling your blood sugar in the last 3 months?","Do you have any other condition that may need special consideration for you to exercise?"];
const APSSSHORT=["A heart condition or stroke","Unexplained chest pain or discomfort","Feeling faint, dizzy or losing balance during activity","A recent asthma attack needing urgent care","Trouble controlling blood sugar","Another condition needing special consideration"];
const apssA={};
function ynHTML(name,i,label){return `<li class="qz-q"><p id="${name}${i}">${label}</p><div class="seg yn" role="radiogroup" aria-labelledby="${name}${i}"><button type="button" role="radio" aria-checked="false" data-yn="${name}" data-i="${i}" data-v="no" tabindex="0">No</button><button type="button" role="radio" aria-checked="false" data-yn="${name}" data-i="${i}" data-v="yes" tabindex="-1">Yes</button></div></li>`;}
function renderAPSS(){const ol=$("#apssQs");if(!ol)return;ol.innerHTML=APSSQ.map((q,i)=>ynHTML("apss",i,q)).join("");apssOut();}
function apssOut(){const out=$("#apssOut");if(!out)return;const ans=APSSQ.map((_,i)=>apssA[i]);const done=ans.filter(a=>a).length;
  if(done<APSSQ.length){out.innerHTML=`<p class="muted">Answer all six questions to see your result. ${done?`(${done} of 6 answered)`:""}</p>`;return;}
  const yes=ans.map((a,i)=>a==="yes"?i:-1).filter(i=>i>=0);
  if(yes.length){out.innerHTML=`<div class="lvl l2"><h4>Get advice before you start</h4><p>You answered yes to: ${yes.map(i=>APSSSHORT[i].toLowerCase()).join("; ")}. Talk to your GP or an allied health professional, such as an exercise physiologist or physiotherapist, before you begin. It doesn't mean you can't train: it means your programme should be shaped around your health.</p></div>`;return;}
  const v=k=>Math.max(0,parseFloat(($(k)||{}).value)||0);const tot=v("#apssL")+v("#apssM")+2*v("#apssV");
  const any=["#apssL","#apssM","#apssV"].some(k=>($(k)||{}).value);
  out.innerHTML=`<div class="lvl l1"><h4>No warning signs flagged</h4><p>${!any?"Add your weekly minutes above for advice on how hard to start.":tot<150?`Your weighted total is ${Math.round(tot)} minutes a week, under 150. Start with light to moderate exercise and increase the amount and intensity slowly.`:`Your weighted total is ${Math.round(tot)} minutes a week. You can carry on at your current intensity, and build up strength training gradually.`}</p><p class="small">If anything changes, such as new chest pain or dizziness, stop and get checked.</p></div>`;}
D.addEventListener("click",e=>{const b=e.target.closest("[data-yn]");if(!b)return;const g=b.closest(".yn");$$("[data-yn]",g).forEach(x=>{x.setAttribute("aria-checked",x===b?"true":"false");x.tabIndex=x===b?0:-1;});
  if(b.dataset.yn==="apss"){apssA[b.dataset.i]=b.dataset.v;apssOut();}else if(b.dataset.yn==="sf"){sfA[b.dataset.i]=+b.dataset.v;sfOut();}});
D.addEventListener("keydown",e=>{const b=e.target.closest&&e.target.closest(".yn [role=radio]");if(!b)return;if(!["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault();const g=b.closest(".yn"),bs=$$("[role=radio]",g),i=bs.indexOf(b),j=(i+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1)+bs.length)%bs.length;bs[j].focus();bs[j].click();});
D.addEventListener("input",e=>{if(["apssL","apssM","apssV"].includes(e.target.id))apssOut();});

/* ---------- Self-check tabs ---------- */
function selectTab(btn){const tl=btn.closest("[role=tablist]");$$("[role=tab]",tl).forEach(t=>{const on=t===btn;t.setAttribute("aria-selected",on?"true":"false");t.tabIndex=on?0:-1;const p=D.getElementById(t.getAttribute("aria-controls"));if(p)p.hidden=!on;});if(btn.id==="tt-chair")chairChart();}
D.addEventListener("click",e=>{const t=e.target.closest(".tool-tabs [role=tab]");if(t)selectTab(t);});
D.addEventListener("keydown",e=>{const t=e.target.closest&&e.target.closest(".tool-tabs [role=tab]");if(!t)return;const ts=$$("[role=tab]",t.closest("[role=tablist]"));let i=ts.indexOf(t);
  if(e.key==="ArrowRight")i=(i+1)%ts.length;else if(e.key==="ArrowLeft")i=(i-1+ts.length)%ts.length;else if(e.key==="Home")i=0;else if(e.key==="End")i=ts.length-1;else return;e.preventDefault();ts[i].focus();selectTab(ts[i]);});

/* ---------- 30-second chair stand ---------- */
const STEADI={60:12,65:11,70:10,75:10,80:9,85:8,90:4};/* below these counts is below average for women (CDC STEADI) */
let csT=0,csEnd=0,csPhase="idle",csTaps=0,actx=null;
function beep(f,d){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;o.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(.0001,actx.currentTime);g.gain.exponentialRampToValueAtTime(.25,actx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.start();o.stop(actx.currentTime+d+.05);}catch(e){}
  try{if(navigator.vibrate)navigator.vibrate(d>0.3?400:120);}catch(e){}}
function csRing(frac){const c=$("#csRing");if(!c)return;const L=2*Math.PI*52;c.style.strokeDasharray=L.toFixed(1);c.style.strokeDashoffset=(L*(1-frac)).toFixed(1);}
function csStop(done){clearInterval(csT);csT=0;const go=$("#csGo");go.textContent=done?"Run it again":"Start the timer";$("#csTap").disabled=true;csPhase="idle";
  if(done){beep(660,.55);$("#csMsg").textContent="Stop. Sit down and rest. Enter how many full stands you did.";$("#csNum").textContent="0";csRing(0);if(csTaps){$("#csCount").value=csTaps;csOut();}const c=$("#csCount");if(c)c.focus();}
  else{$("#csMsg").textContent="Stopped. Ready when you are.";$("#csNum").textContent="30";csRing(1);}}
function csStart(){if(csPhase!=="idle"){csStop(false);return;}csPhase="count";csTaps=0;$("#csTapN").textContent="0";$("#csGo").textContent="Stop";let n=3;$("#csNum").textContent=n;$("#csMsg").textContent="Get ready: arms crossed, feet flat.";csRing(1);beep(440,.12);
  csT=setInterval(()=>{n--;if(n>0){$("#csNum").textContent=n;beep(440,.12);return;}clearInterval(csT);csPhase="run";csEnd=performance.now()+30000;beep(880,.35);$("#csMsg").textContent="Go! Stand up fully, sit down fully.";$("#csTap").disabled=false;
    csT=setInterval(()=>{const left=Math.max(0,csEnd-performance.now());$("#csNum").textContent=Math.ceil(left/1000);csRing(left/30000);if(left<=0)csStop(true);},100);},1000);}
function csOut(){const out=$("#csOut");if(!out)return;const n=parseInt($("#csCount").value,10),age=$("#csAge").value;if(!(n>=0)){out.innerHTML=`<p class="muted">Enter your count and age to see how it compares.</p>`;return;}
  if(!age){out.innerHTML=`<p>${n} full stands. Choose your age to compare with reference scores.</p>`;return;}
  if(age==="u60"){out.innerHTML=`<div class="lvl l1"><h4>${n} full stands</h4><p>The CDC reference scores start at age 60, so use this as your baseline and repeat the test every couple of months. Rising scores mean stronger legs.</p></div>`;return;}
  const cut=STEADI[age];const below=n<cut;
  out.innerHTML=below?`<div class="lvl l2"><h4>${n} full stands: below average for your age</h4><p>For women aged ${age} to ${+age+4}, fewer than ${cut} is below average, which the CDC links with a higher risk of falls. Strength and balance training can improve it: ask your GP, a physiotherapist or an exercise physiologist about a programme. <span class="ev" data-r="STEADI"></span></p></div>`:`<div class="lvl l1"><h4>${n} full stands: average or better for your age</h4><p>For women aged ${age} to ${+age+4}, fewer than ${cut} is below average. Keep training, and repeat the test every couple of months. <span class="ev" data-r="STEADI"></span></p></div>`;renderEv(out);}
function chairHist(){return store.get("chair",[]);}
function chairChart(){const h=chairHist(),list=$("#csList");if(list)list.innerHTML=h.length?h.slice().reverse().map(r=>`<li><span><b>${fmtDate(r.d)}</b> · ${r.n} stands</span><button type="button" class="mini" data-del-chair="${r.id}" aria-label="Delete result from ${fmtDate(r.d)}">Delete</button></li>`).join(""):"";
  if(!h.length){chartDef("chChair",{empty:"Save a result and your scores over time will show here."});return;}
  chartDef("chChair",{type:"line",label:"Your 30-second chair-stand results over time",x:h.map(r=>fmtDate(r.d).replace(/ \d{4}$/,"")),xName:"Date",series:[{name:"Full stands in 30 seconds",values:h.map(r=>r.n)}],fmt:v=>v+" stands",yMin:0,h:210});}
D.addEventListener("click",e=>{if(e.target.closest("#csGo"))csStart();else if(e.target.closest("#csTap")){if(csPhase!=="run")return;csTaps++;$("#csTapN").textContent=csTaps;}
  else if(e.target.closest("#csSave")){const n=parseInt($("#csCount").value,10);if(!(n>=0&&n<=60)){toast("Enter your count first");$("#csCount").focus();return;}const h=chairHist();h.push({id:Date.now().toString(36),d:todayISO(),n});store.set("chair",h.slice(-60));toast("Result saved");chairChart();}
  else{const b=e.target.closest("[data-del-chair]");if(b){if(b.dataset.armed!=="1"){b.dataset.armed="1";b.textContent="Tap again to delete";setTimeout(()=>{if(b.isConnected){b.dataset.armed="";b.textContent="Delete";}},4000);return;}store.set("chair",chairHist().filter(r=>r.id!==b.dataset.delChair));chairChart();}}});
D.addEventListener("input",e=>{if(e.target.id==="csCount")csOut();});D.addEventListener("change",e=>{if(e.target.id==="csAge"){store.set("age",e.target.value);csOut();}});

/* ---------- Five chair rises: a stopwatch ---------- */
let fsT=0,fs0=0,fsRun=false,fsLast=0;
function fsShow(ms){$("#fsTime").textContent=(ms/1000).toFixed(1)+" s";}
D.addEventListener("click",e=>{if(e.target.closest("#fsGo")){if(!fsRun){fsRun=true;fs0=performance.now();$("#fsGo").textContent="Stop";$("#fsOut").innerHTML="";fsT=setInterval(()=>fsShow(performance.now()-fs0),100);}
    else{fsRun=false;clearInterval(fsT);fsLast=performance.now()-fs0;fsShow(fsLast);$("#fsGo").textContent="Start";const s=fsLast/1000;
      $("#fsOut").innerHTML=s>15?`<div class="lvl l2"><h4>${s.toFixed(1)} seconds</h4><p>More than 15 seconds for five rises suggests low leg strength by the European definition. It's worth discussing with your GP, and strength training can improve it. <span class="ev" data-r="EWGSOP2"></span></p></div>`:`<div class="lvl l1"><h4>${s.toFixed(1)} seconds</h4><p>Under the 15-second cut-off used to flag low strength. Keep training, and repeat it now and then. <span class="ev" data-r="EWGSOP2"></span></p></div>`;renderEv($("#fsOut"));}}
  else if(e.target.closest("#fsReset")){fsRun=false;clearInterval(fsT);fsShow(0);$("#fsGo").textContent="Start";$("#fsOut").innerHTML="";}});

/* ---------- Grip strength ---------- */
function gripOut(){const kg=parseFloat($("#grKg").value),out=$("#grOut"),bar=$("#grBar");if(!(kg>0)){out.innerHTML=`<p class="muted">Enter a result in kilograms.</p>`;bar.innerHTML="";return;}
  const max=45,pos=Math.min(100,kg/max*100);bar.innerHTML=`<div class="gb-track"><span class="gb-low" style="width:${16/max*100}%"></span><span class="gb-peak" style="left:${31/max*100}%"></span><span class="gb-you" style="left:${pos}%"></span></div><div class="gb-lab"><span style="left:${16/max*100}%">16 kg</span><span style="left:${31/max*100}%">31 kg</span></div>`;
  out.innerHTML=(kg<16?`<div class="lvl l2"><h4>${kg} kg: below the cut-off for low strength</h4><p>Under 16 kg in women is the European cut-off for low muscle strength. Talk to your GP about a sarcopenia check, and about a strength programme.</p></div>`:`<div class="lvl l1"><h4>${kg} kg: above the cut-off for low strength</h4><p>The European cut-off for low strength in women is 16 kg.</p></div>`)+`<p class="small muted">For context, in British population data women's grip peaked at a median of 31 kg between ages 26 and 42 and declined from midlife. Results vary with the device and position used, so compare like with like. <span class="ev" data-r="EWGSOP2 GRIP"></span></p>`;renderEv(out);}
D.addEventListener("input",e=>{if(e.target.id==="grKg")gripOut();});

/* ---------- SARC-F ---------- */
const SFQ=[["Strength","How much difficulty do you have lifting and carrying about 4.5 kg (10 pounds)?",["None","Some","A lot, or unable"]],["Help walking","How much difficulty do you have walking across a room?",["None","Some","A lot, use aids, or unable"]],["Rising from a chair","How much difficulty do you have moving from a chair or bed?",["None","Some","A lot, or unable without help"]],["Climbing stairs","How much difficulty do you have climbing a flight of 10 stairs?",["None","Some","A lot, or unable"]],["Falls","How many times have you fallen in the past year?",["None","1 to 3 falls","4 or more falls"]]];
const sfA={};
function renderSF(){const ol=$("#sfQs");if(!ol)return;ol.innerHTML=SFQ.map((q,i)=>`<li class="qz-q"><p id="sf${i}"><b>${q[0]}.</b> ${q[1]}</p><div class="seg yn three" role="radiogroup" aria-labelledby="sf${i}">${q[2].map((o,v)=>`<button type="button" role="radio" aria-checked="false" data-yn="sf" data-i="${i}" data-v="${v}" tabindex="${v===0?0:-1}">${o}</button>`).join("")}</div></li>`).join("");sfOut();}
function sfOut(){const out=$("#sfOut");if(!out)return;const n=Object.keys(sfA).length;if(n<SFQ.length){out.innerHTML=`<p class="muted">Answer all five questions for your score.${n?` (${n} of 5 answered)`:""}</p>`;return;}
  const sc=Object.values(sfA).reduce((a,b)=>a+b,0);out.innerHTML=sc>=4?`<div class="lvl l2"><h4>Score ${sc} out of 10</h4><p>A score of 4 or more suggests sarcopenia is likely. Ask your GP about a proper assessment, which usually includes a strength test such as grip or chair rises. Strength training and enough protein are the main treatments.</p></div>`:`<div class="lvl l1"><h4>Score ${sc} out of 10</h4><p>Under 4, so sarcopenia is less likely on this screen. It is a quick screen, not a diagnosis: the chair-stand and grip tests add detail.</p></div>`;}
onView("tests",()=>{if(!$("#sfQs").children.length)renderSF();chairChart();const a=store.get("age","");if(a&&$("#csAge"))$("#csAge").value=a;csRing(1);});
onView("safe",()=>{if(!$("#apssQs").children.length)renderAPSS();});
onLeave((from)=>{if(from==="tests"&&csPhase!=="idle")csStop(false);if(from==="tests"&&fsRun){fsRun=false;clearInterval(fsT);}});
