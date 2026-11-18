/* ---------- Diagrams ---------- */
/* Sarcomere: two states, with a gentle automatic cycle while on screen until you choose a state yourself */
(function(){const svg=D.getElementById("sxSvg");if(!svg)return;let state="relaxed",auto=true,vis=false,t=0;
  function set(s,user){state=s;if(user)auto=false;svg.classList.toggle("con",s==="contracted");$$("[data-sx]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sx===s?"true":"false"));
    $$("[data-sx-say]").forEach(el=>el.hidden=el.dataset.sxSay!==s);}
  function tick(){clearTimeout(t);if(!auto||!vis||!motionOK())return;t=setTimeout(()=>{set(state==="relaxed"?"contracted":"relaxed",false);tick();},2600);}
  D.addEventListener("click",e=>{const b=e.target.closest("[data-sx]");if(!b)return;set(b.dataset.sx,true);clearTimeout(t);});
  whenVisible(svg,v=>{vis=v;tick();});onMotion(tick);set("relaxed",false);})();

/* Effort gauge: reps in reserve */
(function(){const svg=D.querySelector("svg.rir");if(!svg)return;const g=svg.querySelector(".rir-arcs");const cx=170,cy=132,r1=78,r2=112;
  const segs=[{l:"5+",z:0},{l:"4",z:0},{l:"3",z:1},{l:"2",z:1},{l:"1",z:1},{l:"0",z:2}];const n=segs.length,gapA=1.6;
  const pt=(a,r)=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)];
  let h="";segs.forEach((s,i)=>{const a0=180-i*180/n-gapA/2,a1=180-(i+1)*180/n+gapA/2;const p1=pt(a0,r2),p2=pt(a1,r2),p3=pt(a1,r1),p4=pt(a0,r1);
    h+=`<path class="rir-seg z${s.z}" d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}A${r2} ${r2} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}A${r1} ${r1} 0 0 0 ${p4[0].toFixed(1)} ${p4[1].toFixed(1)}Z"/>`;
    const am=(a0+a1)/2,pl=pt(am,(r1+r2)/2);h+=`<text class="rir-n z${s.z}" x="${pl[0].toFixed(1)}" y="${(pl[1]+5).toFixed(1)}" text-anchor="middle">${s.l}</text>`;});
  const pe=pt(180,r2+8),pf=pt(0,r2+8);h+=`<text class="rir-e" x="${(cx-(r1+r2)/2).toFixed(1)}" y="${(cy+20).toFixed(1)}" text-anchor="middle">Easy</text><text class="rir-e" x="${(cx+(r1+r2)/2).toFixed(1)}" y="${(cy+20).toFixed(1)}" text-anchor="middle">Can't do another</text>`;
  const za=180-2*180/n,zb=180-5*180/n,q1=pt(za,r2+10),q2=pt(zb,r2+10);h+=`<path class="rir-zone" d="M${q1[0].toFixed(1)} ${q1[1].toFixed(1)}A${r2+10} ${r2+10} 0 0 1 ${q2[0].toFixed(1)} ${q2[1].toFixed(1)}"/>`;
  g.innerHTML=h;})();

/* Double progression: an example over nine sessions */
(function(){const svg=D.querySelector("svg.dp");if(!svg)return;const reps=[8,9,10,11,12,8,9,10,11],kg=[6,6,6,6,6,7,7,7,7];
  const L=40,B=170,T=24,W=290,H=B-T,n=reps.length,bw=20,step=W/n;const Y=r=>B-(r-6)/(13-6)*H;
  let h=`<line class="dp-base" x1="${L}" x2="${L+W}" y1="${B}" y2="${B}"/>`;[8,10,12].forEach(r=>{h+=`<line class="dp-grid" x1="${L}" x2="${L+W}" y1="${Y(r)}" y2="${Y(r)}"/><text class="dp-tk" x="${L-8}" y="${Y(r)+4}" text-anchor="end">${r}</text>`;});
  h+=`<text class="dp-ax" x="${L-30}" y="${T-8}">Reps</text>`;
  reps.forEach((r,i)=>{const x=L+i*step+(step-bw)/2,y=Y(r);h+=`<path class="dp-bar ${kg[i]===6?"k1":"k2"}" d="M${x} ${B}V${y+4}Q${x} ${y} ${x+4} ${y}H${x+bw-4}Q${x+bw} ${y} ${x+bw} ${y+4}V${B}Z"/><text class="dp-tk" x="${x+bw/2}" y="${B+16}" text-anchor="middle">${i+1}</text>`;});
  const xs=L+5*step;h+=`<line class="dp-step" x1="${xs}" x2="${xs}" y1="${T-4}" y2="${B}"/><text class="dp-lab" x="${L+2.5*step}" y="${T+2}" text-anchor="middle">6 kg</text><text class="dp-lab b" x="${L+7*step}" y="${T+2}" text-anchor="middle">7 kg</text>`;
  h+=`<text class="dp-ax" x="${L+W/2}" y="${B+36}" text-anchor="middle">Session</text>`;svg.innerHTML=h;})();

/* Balance ladder: four stances seen from above */
(function(){const svg=D.querySelector("svg.bal");if(!svg)return;
  const foot=(x,y,flip,lift)=>`<g transform="translate(${x} ${y})${flip?" scale(-1 1)":""}"><path class="bal-ft${lift?" lift":""}" d="M0 -26C7 -26 10 -18 10 -8C10 4 8 16 5 22C3 26 -3 26 -5 22C-8 14 -9 2 -8 -8C-7 -18 -6 -26 0 -26Z"/><circle class="bal-toe${lift?" lift":""}" cx="-3" cy="-31" r="2.6"/><circle class="bal-toe${lift?" lift":""}" cx="3.5" cy="-31.5" r="2.4"/></g>`;
  const P=[{x:42,t:"Together",f:[[-11,0],[11,0]]},{x:127,t:"Semi-tandem",f:[[-7,10],[9,-14]]},{x:212,t:"Tandem",f:[[0,26],[0,-26]]},{x:297,t:"One leg",f:[[-6,0],[14,0,1]]}];
  let h="";P.forEach((p,i)=>{h+=`<g class="bal-p"><rect class="bal-bg" x="${p.x-38}" y="14" width="76" height="118" rx="12"/>`;p.f.forEach((f,j)=>{h+=foot(p.x+f[0],76+f[1],j===0,f[2]);});
    h+=`<text class="bal-t" x="${p.x}" y="152" text-anchor="middle">${p.t}</text><text class="bal-n" x="${p.x}" y="168" text-anchor="middle">Step ${i+1}</text></g>`;
    if(i<3)h+=`<path class="bal-ar" d="M${p.x+41} 73l6 4-6 4"/>`;});
  svg.innerHTML=h;})();

/* Hero artwork moves only while the start page is on screen and motion is allowed */
(function(){const hx=D.querySelector(".hx");if(!hx)return;let vis=false;const sync=()=>hx.classList.toggle("on",vis&&motionOK());whenVisible(hx,v=>{vis=v;sync();});onMotion(sync);})();

/* Charts that appear in the reading sections */
function lossChart(){const yrs=[...Array(11).keys()];const m=yrs.map(y=>+(100*Math.pow(1-0.0067,y)).toFixed(1)),s=yrs.map(y=>+(100*Math.pow(1-0.0275,y)).toFixed(1));
  chartDef("chLoss",{type:"line",label:"Illustration: muscle mass and strength over 10 years from age 75, starting at 100",x:yrs.map(y=>String(75+y)),xName:"Age",xTitle:"Age",series:[{name:"Muscle mass",values:m},{name:"Strength",values:s}],yMin:70,yMax:100,yTicks:[70,80,90,100],fmt:v=>v.toFixed(1),h:250});}
function ffmChart(){chartDef("chFFM",{type:"hbar",label:"Share of weight lost that was fat-free mass, by weight-loss method",cats:["Diet plus exercise","Diet alone","Incretin (GLP-1 type) medicines","Weight-loss surgery"],values:[7.7,22.3,33.3,34.2],max:40,unit:"%",fmt:v=>v.toFixed(1)+"%",catName:"Method",valName:"Fat-free mass as % of weight lost"});}
onView("muscle",lossChart);onView("eat",ffmChart);
