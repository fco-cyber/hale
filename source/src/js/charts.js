/* ---------- Charts: drawn at the measured width of their box, with a table view ----------
   One axis only; thin marks; solid hairline grid; text in ink colours; series identity also given by legend and labels. */
const CHARTS={};
function chartDef(id,spec){CHARTS[id]=spec;const el=D.getElementById(id);if(!el)return;if(!el._ro&&"ResizeObserver" in window){let w0=0;el._ro=new ResizeObserver(es=>{const w=Math.round(es[0].contentRect.width);if(w&&Math.abs(w-w0)>2){w0=w;drawChart(id);}});el._ro.observe(el);}drawChart(id);}
function niceTicks(min,max,n){const span=max-min||1;const step0=span/Math.max(1,n);const mag=Math.pow(10,Math.floor(Math.log10(step0)));const err=step0/mag;const step=(err>=7.5?10:err>=3.5?5:err>=1.5?2:1)*mag;const lo=Math.floor(min/step)*step,hi=Math.ceil(max/step)*step;const t=[];for(let v=lo;v<=hi+step/2;v+=step)t.push(+v.toFixed(6));return t;}
function txtW(s,px){return String(s).length*px*0.56;}
function drawChart(id){const spec=CHARTS[id],el=D.getElementById(id);if(!spec||!el)return;
  const W=Math.max(260,el.clientWidth||300);
  if(spec.empty){el.innerHTML=`<p class="ch-empty">${esc(spec.empty)}</p>`;renderTable(id);return;}
  if(spec.type==="line")drawLine(el,spec,W);else if(spec.type==="bar")drawBar(el,spec,W);else if(spec.type==="hbar")drawHBar(el,spec,W);
  renderTable(id);}
function tipEl(el){let t=el.querySelector(".ch-tip");if(!t){t=D.createElement("div");t.className="ch-tip";t.setAttribute("role","status");t.hidden=true;el.appendChild(t);}return t;}
function showTip(el,x,y,lines){const t=tipEl(el);t.textContent="";lines.forEach((l,i)=>{const d=D.createElement("div");if(i===0)d.className="ch-tip-h";d.textContent=l;t.appendChild(d);});t.hidden=false;
  const W=el.clientWidth,tw=t.offsetWidth,th=t.offsetHeight;let left=x+12;if(left+tw>W-4)left=x-tw-12;if(left<4)left=4;let top=y-th-10;if(top<0)top=y+14;t.style.left=left+"px";t.style.top=top+"px";}
function hideTip(el){const t=el.querySelector(".ch-tip");if(t)t.hidden=true;}

function drawLine(el,s,W){const H=s.h||240,fs=12;const n=s.x.length;
  const all=s.series.flatMap(se=>se.values.filter(v=>v!=null));let mn=s.yMin!=null?s.yMin:Math.min(...all),mx=s.yMax!=null?s.yMax:Math.max(...all);if(mn===mx){mn-=1;mx+=1;}
  const ticks=s.yTicks||niceTicks(mn,mx,4);mn=Math.min(mn,ticks[0]);mx=Math.max(mx,ticks[ticks.length-1]);
  const yl=Math.max(...ticks.map(t=>txtW(s.fmtTick?s.fmtTick(t):t,fs)));
  const labW=s.series.length>1?Math.max(...s.series.map(se=>txtW(se.name,fs)))+14:16;
  const L=Math.round(yl+12),Rr=Math.round(Math.min(labW,W*0.32)),T=14,B=s.xTitle?46:30;
  const pw=W-L-Rr,ph=H-T-B;const X=i=>L+(n===1?pw/2:i*pw/(n-1)),Y=v=>T+ph-(v-mn)/(mx-mn)*ph;
  let g=`<svg class="ch" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(s.label)}">`;
  ticks.forEach(t=>{const y=Y(t).toFixed(1);g+=`<line class="ch-grid" x1="${L}" x2="${L+pw}" y1="${y}" y2="${y}"/><text class="ch-tk" x="${L-8}" y="${(+y+4).toFixed(1)}" text-anchor="end">${esc(s.fmtTick?s.fmtTick(t):t)}</text>`;});
  const every=Math.max(1,Math.ceil(n/Math.max(2,Math.floor(pw/58))));
  s.x.forEach((lab,i)=>{if(i%every!==0&&i!==n-1)return;if(i!==n-1&&n-1-i<every*0.6)return;g+=`<text class="ch-tk" x="${X(i).toFixed(1)}" y="${T+ph+18}" text-anchor="middle">${esc(lab)}</text>`;});
  if(s.xTitle)g+=`<text class="ch-ax" x="${L+pw/2}" y="${H-6}" text-anchor="middle">${esc(s.xTitle)}</text>`;
  g+=`<line class="ch-base" x1="${L}" x2="${L+pw}" y1="${T+ph}" y2="${T+ph}"/>`;
  g+=`<line class="ch-cross" x1="0" x2="0" y1="${T}" y2="${T+ph}" visibility="hidden"/>`;
  s.series.forEach((se,k)=>{const pts=se.values.map((v,i)=>v==null?null:[X(i),Y(v)]);let d="",pen=false;pts.forEach(p=>{if(!p){pen=false;return;}d+=(pen?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1);pen=true;});
    g+=`<path class="ch-line s${k+1}" d="${d}"/>`;});
  s.series.forEach((se,k)=>{se.values.forEach((v,i)=>{if(v==null)return;const show=s.points!==false&&(n<=24||i===n-1);g+=`<circle class="ch-pt s${k+1}${show?"":" quiet"}" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" tabindex="${show?0:-1}" data-i="${i}" aria-label="${esc(s.x[i]+": "+se.name+" "+(s.fmt?s.fmt(v):v))}"/>`;});});
  if(s.series.length>1){/* direct labels at line ends, nudged apart */const ends=s.series.map((se,k)=>{let i=se.values.length-1;while(i>=0&&se.values[i]==null)i--;return {k,y:Y(se.values[i]),name:se.name};}).sort((a,b)=>a.y-b.y);for(let j=1;j<ends.length;j++){if(ends[j].y-ends[j-1].y<15)ends[j].y=ends[j-1].y+15;}
    ends.forEach(e=>{g+=`<text class="ch-dl" x="${L+pw+8}" y="${(e.y+4).toFixed(1)}">${esc(e.name)}</text>`;});}
  g+=`<rect class="ch-hit" x="${L}" y="${T}" width="${pw}" height="${ph}" fill="transparent"/></svg>`;
  let leg="";if(s.series.length>1)leg=`<div class="ch-legend">${s.series.map((se,k)=>`<span><i class="sw s${k+1}"></i>${esc(se.name)}</span>`).join("")}</div>`;
  el.innerHTML=leg+g;const svg=el.querySelector("svg"),cross=svg.querySelector(".ch-cross");
  const at=i=>{const x=X(i);cross.setAttribute("x1",x);cross.setAttribute("x2",x);cross.setAttribute("visibility","visible");
    svg.querySelectorAll(".ch-pt").forEach(c=>c.classList.toggle("on",+c.dataset.i===i));
    const lines=[s.x[i]].concat(s.series.map(se=>se.values[i]==null?null:(s.series.length>1?se.name+": ":"")+(s.fmt?s.fmt(se.values[i]):se.values[i])).filter(Boolean));if(s.tipExtra){const ex=s.tipExtra(i);if(ex)lines.push(ex);}
    const r=svg.getBoundingClientRect(),er=el.getBoundingClientRect();const ys=s.series.map(se=>se.values[i]).filter(v=>v!=null).map(Y);showTip(el,x*(r.width/W)+(r.left-er.left),Math.min(...ys)*(r.height/H)+(r.top-er.top),lines);};
  const clear=()=>{cross.setAttribute("visibility","hidden");svg.querySelectorAll(".ch-pt.on").forEach(c=>c.classList.remove("on"));hideTip(el);};
  svg.querySelector(".ch-hit").addEventListener("pointermove",e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)*(W/r.width);const i=clamp(Math.round((x-L)/(pw/(Math.max(1,n-1)))),0,n-1);at(n===1?0:i);});
  svg.querySelector(".ch-hit").addEventListener("pointerleave",clear);
  svg.querySelectorAll(".ch-pt").forEach(c=>{c.addEventListener("focus",()=>at(+c.dataset.i));c.addEventListener("blur",clear);});}

function drawBar(el,s,W){const H=s.h||230,fs=12,n=s.cats.length;const vals=s.values.map(v=>v||0);const mx0=Math.max(s.target||0,...vals,s.minMax||0);const ticks=niceTicks(0,mx0*1.08||10,4);const mx=ticks[ticks.length-1];
  const yl=Math.max(...ticks.map(t=>txtW(t,fs)));const L=Math.round(yl+12),Rr=14,T=16,B=30;const pw=W-L-Rr,ph=H-T-B;const bw=Math.min(64,pw/n*0.62),gap=pw/n;
  const Y=v=>T+ph-v/mx*ph;let g=`<svg class="ch" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(s.label)}">`;
  ticks.forEach(t=>{const y=Y(t).toFixed(1);g+=`<line class="ch-grid" x1="${L}" x2="${L+pw}" y1="${y}" y2="${y}"/><text class="ch-tk" x="${L-8}" y="${(+y+4).toFixed(1)}" text-anchor="end">${t}</text>`;});
  vals.forEach((v,i)=>{const x=L+gap*i+(gap-bw)/2,y=Y(v),h=Math.max(0,T+ph-y);const r=Math.min(4,bw/2,h);
    const d=h<0.5?"":`M${x.toFixed(1)} ${(T+ph).toFixed(1)}V${(y+r).toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${(x+r).toFixed(1)} ${y.toFixed(1)}H${(x+bw-r).toFixed(1)}Q${(x+bw).toFixed(1)} ${y.toFixed(1)} ${(x+bw).toFixed(1)} ${(y+r).toFixed(1)}V${(T+ph).toFixed(1)}Z`;
    const judged=s.target&&(!s.judge||s.judge.includes(i));const ok=judged?v>=s.target:true;
    let ly=y-6,lc="ch-val";if(s.target){const yt=Y(s.target);if(Math.abs(ly-4-yt)<10){if(h>30){ly=Math.max(y+16,yt+16);lc+=" in"+(judged&&!ok?"":" on");}else ly=yt-8;}}
    g+=`<g class="ch-barg" tabindex="0" data-i="${i}" role="img" aria-label="${esc(s.cats[i]+": "+(s.fmt?s.fmt(v):v)+(judged?(ok?", meets":", below")+" the target":""))}"><rect class="ch-hitbar" x="${(L+gap*i).toFixed(1)}" y="${T}" width="${gap.toFixed(1)}" height="${ph}" fill="transparent"/>${d?`<path class="ch-bar${judged&&!ok?" low":""}${s.target&&!judged?" side":""}" d="${d}"/>`:""}<text class="${lc}" x="${(x+bw/2).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle">${esc(s.fmt?s.fmt(v):v)}</text></g>`;
    g+=`<text class="ch-tk" x="${(x+bw/2).toFixed(1)}" y="${T+ph+18}" text-anchor="middle">${esc(s.cats[i])}</text>`;});
  g+=`<line class="ch-base" x1="${L}" x2="${L+pw}" y1="${T+ph}" y2="${T+ph}"/>`;
  if(s.target){const y=Y(s.target).toFixed(1);g+=`<line class="ch-ref" x1="${L}" x2="${L+pw}" y1="${y}" y2="${y}"/><text class="ch-reft" x="${L+pw}" y="${(+y-6).toFixed(1)}" text-anchor="end">${esc(s.targetLabel||"Target")}</text>`;}
  g+=`</svg>`;el.innerHTML=g;const svg=el.querySelector("svg");
  svg.querySelectorAll(".ch-barg").forEach(b=>{const i=+b.dataset.i;const f=()=>{const r=b.getBoundingClientRect(),er=el.getBoundingClientRect();svg.querySelectorAll(".ch-barg").forEach(o=>o.classList.toggle("on",o===b));showTip(el,r.left-er.left+r.width/2,Math.max(10,Y(vals[i])*(svg.getBoundingClientRect().height/H)),[s.cats[i],(s.fmt?s.fmt(vals[i]):vals[i])+(s.target?" (target "+(s.fmt?s.fmt(s.target):s.target)+")":"")]);};
    b.addEventListener("pointerenter",f);b.addEventListener("focus",f);b.addEventListener("pointerleave",()=>{b.classList.remove("on");hideTip(el);});b.addEventListener("blur",()=>{b.classList.remove("on");hideTip(el);});});}

function drawHBar(el,s,W){const fs=12,n=s.cats.length,rowH=s.rowH||46;const mx=s.max||Math.max(...s.values)*1.1;
  const narrow=W<520;const labW=narrow?0:Math.min(W*0.38,Math.max(...s.cats.map(c=>txtW(c,fs)))+12);
  const L=Math.round(labW+4),Rr=56,T=6;const pw=W-L-Rr;const H=T+n*(narrow?rowH+16:rowH)+20;const X=v=>L+v/mx*pw;
  let g=`<svg class="ch" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(s.label)}">`;
  const ticks=niceTicks(0,mx,4).filter(t=>t<=mx);ticks.forEach(t=>{const x=X(t).toFixed(1);g+=`<line class="ch-grid" x1="${x}" x2="${x}" y1="${T}" y2="${H-20}"/><text class="ch-tk" x="${x}" y="${H-4}" text-anchor="middle">${t}${s.unit||""}</text>`;});
  s.values.forEach((v,i)=>{const rh=narrow?rowH+16:rowH;const y0=T+i*rh+(narrow?18:0);const bh=Math.min(22,rowH*0.5),y=y0+(rowH-bh)/2,x1=X(v),r=Math.min(4,bh/2);
    if(narrow)g+=`<text class="ch-cat" x="${L}" y="${(y0+6).toFixed(1)}">${esc(s.cats[i])}</text>`;else g+=`<text class="ch-cat" x="${L-10}" y="${(y+bh/2+4).toFixed(1)}" text-anchor="end">${esc(s.cats[i])}</text>`;
    const d=`M${L} ${y.toFixed(1)}H${(x1-r).toFixed(1)}Q${x1.toFixed(1)} ${y.toFixed(1)} ${x1.toFixed(1)} ${(y+r).toFixed(1)}V${(y+bh-r).toFixed(1)}Q${x1.toFixed(1)} ${(y+bh).toFixed(1)} ${(x1-r).toFixed(1)} ${(y+bh).toFixed(1)}H${L}Z`;
    g+=`<g class="ch-barg" tabindex="0" data-i="${i}" role="img" aria-label="${esc(s.cats[i]+": "+(s.fmt?s.fmt(v):v))}"><rect x="${L}" y="${y0}" width="${pw}" height="${rowH}" fill="transparent"/><path class="ch-bar" d="${d}"/><text class="ch-val" x="${(x1+8).toFixed(1)}" y="${(y+bh/2+4).toFixed(1)}">${esc(s.fmt?s.fmt(v):v)}</text></g>`;});
  g+=`<line class="ch-base" x1="${L}" x2="${L}" y1="${T}" y2="${H-20}"/></svg>`;el.innerHTML=g;const svg=el.querySelector("svg");
  svg.querySelectorAll(".ch-barg").forEach(b=>{const i=+b.dataset.i;const f=()=>{const r=b.getBoundingClientRect(),er=el.getBoundingClientRect();svg.querySelectorAll(".ch-barg").forEach(o=>o.classList.toggle("on",o===b));showTip(el,Math.min(er.width-20,X(s.values[i])*(svg.getBoundingClientRect().width/W)),r.top-er.top+4,[s.cats[i],(s.fmt?s.fmt(s.values[i]):s.values[i])+(s.tipExtra?" "+s.tipExtra(i):"")]);};
    b.addEventListener("pointerenter",f);b.addEventListener("focus",f);b.addEventListener("pointerleave",()=>{b.classList.remove("on");hideTip(el);});b.addEventListener("blur",()=>{b.classList.remove("on");hideTip(el);});});}

/* Table view: the same numbers, for screen readers, printing and anyone who prefers a table */
function renderTable(id){const s=CHARTS[id],el=D.getElementById(id);if(!s||!el)return;const btn=D.querySelector(`[data-table-for="${id}"]`);const on=btn&&btn.getAttribute("aria-pressed")==="true";
  let box=D.getElementById(id+"-tbl");if(!box){box=D.createElement("div");box.id=id+"-tbl";box.className="tbl-wrap ch-table";el.after(box);}
  box.hidden=!on;el.hidden=on&&!s.empty;if(!on)return;
  let h="";if(s.empty){box.innerHTML=`<p class="ch-empty">${esc(s.empty)}</p>`;return;}
  if(s.type==="line"){h=`<table><caption class="sr-only">${esc(s.label)}</caption><thead><tr><th scope="col">${esc(s.xName||"")}</th>${s.series.map(se=>`<th scope="col">${esc(se.name)}</th>`).join("")}</tr></thead><tbody>${s.x.map((x,i)=>`<tr><th scope="row">${esc(x)}</th>${s.series.map(se=>`<td class="num">${se.values[i]==null?"–":esc(s.fmt?s.fmt(se.values[i]):se.values[i])}</td>`).join("")}</tr>`).join("")}</tbody></table>`;}
  else{h=`<table><caption class="sr-only">${esc(s.label)}</caption><thead><tr><th scope="col">${esc(s.catName||"")}</th><th scope="col">${esc(s.valName||"Value")}</th></tr></thead><tbody>${s.cats.map((c,i)=>`<tr><th scope="row">${esc(c)}</th><td class="num">${esc(s.fmt?s.fmt(s.values[i]||0):s.values[i])}</td></tr>`).join("")}${s.target?`<tr><th scope="row">${esc(s.targetLabel||"Target")}</th><td class="num">${esc(s.fmt?s.fmt(s.target):s.target)}</td></tr>`:""}</tbody></table>`;}
  box.innerHTML=h;}
D.addEventListener("click",e=>{const b=e.target.closest("[data-table-for]");if(!b)return;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on?"true":"false");b.textContent=on?"Show chart":"Show table";renderTable(b.dataset.tableFor);if(!on)drawChart(b.dataset.tableFor);});
onTheme(()=>Object.keys(CHARTS).forEach(id=>{const el=D.getElementById(id);if(el&&el.offsetParent)drawChart(id);}));
