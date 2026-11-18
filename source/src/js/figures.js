/* ---------- Exercise figures: a simple side-view figure moving between key positions ----------
   Each exercise gives 2 to 4 key positions. A position sets the hip, the trunk and head angles, and for each
   limb either an end point (ankle or wrist, solved with two-bone inverse kinematics so feet and hands stay
   planted) or two joint angles. Angles are in degrees: 0 points right, 90 points up. */
const FIG={shin:40,thigh:42,trunk:56,head:20,uarm:29,farm:26,foot:15,ground:185};
const RAD=Math.PI/180;
const dirv=a=>[Math.cos(a*RAD),-Math.sin(a*RAD)];
const addv=(p,a,l)=>{const d=dirv(a);return [p[0]+d[0]*l,p[1]+d[1]*l];};
const lerp=(a,b,t)=>a+(b-a)*t;
const lerpAng=(a,b,t)=>{let d=((b-a)%360+540)%360-180;return a+d*t;};
function ik2(P,T,L1,L2,bend){let dx=T[0]-P[0],dy=T[1]-P[1];let d=Math.hypot(dx,dy)||0.001;const dMax=L1+L2-0.01,dMin=Math.abs(L1-L2)+0.01;
  let tx=T[0],ty=T[1];if(d>dMax){tx=P[0]+dx/d*dMax;ty=P[1]+dy/d*dMax;d=dMax;}if(d<dMin){d=dMin;}
  const a=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a));const ux=(tx-P[0])/d,uy=(ty-P[1])/d;const bx=P[0]+ux*a,by=P[1]+uy*a;
  const nx=bend>0?uy:-uy,ny=bend>0?-ux:ux;return {m:[bx+nx*h,by+ny*h],e:[tx,ty]};}
function lerpLimb(a,b,t){if(!a)return b;if(!b)return a;const o={};
  if(a.p&&b.p)o.p=[lerp(a.p[0],b.p[0],t),lerp(a.p[1],b.p[1],t)];
  ["u","l","f"].forEach(k=>{if(a[k]!=null&&b[k]!=null)o[k]=lerpAng(a[k],b[k],t);});
  o.bend=a.bend;return o;}
function lerpPose(A,B,t){return {hip:[lerp(A.hip[0],B.hip[0],t),lerp(A.hip[1],B.hip[1],t)],to:lerpAng(A.to,B.to,t),ne:lerpAng(A.ne,B.ne,t),
  leg:lerpLimb(A.leg,B.leg,t),leg2:lerpLimb(A.leg2,B.leg2,t),arm:lerpLimb(A.arm,B.arm,t),arm2:lerpLimb(A.arm2,B.arm2,t)};}
function solveLimb(base,lim,L1,L2,footLen){const o={a:base};
  if(lim.p){const r=ik2(base,lim.p,L1,L2,lim.bend||1);o.b=r.m;o.c=r.e;}
  else{o.b=addv(base,lim.u,L1);o.c=addv(o.b,lim.l,L2);}
  if(footLen)o.d=addv(o.c,lim.f==null?0:lim.f,footLen);return o;}
function solve(P){const hip=P.hip,sh=addv(hip,P.to,FIG.trunk),head=addv(sh,P.ne,FIG.head);
  const leg=solveLimb(hip,P.leg,FIG.thigh,FIG.shin,FIG.foot);
  const leg2=P.leg2?solveLimb(hip,P.leg2,FIG.thigh,FIG.shin,FIG.foot):null;
  const arm=solveLimb(sh,P.arm,FIG.uarm,FIG.farm,0);
  const arm2=P.arm2?solveLimb(sh,P.arm2,FIG.uarm,FIG.farm,0):null;
  return {hip,sh,head,leg,leg2,arm,arm2};}
/* the far-side limb, when not given, copies the near one a few units behind */
function withFar(P){const Q=Object.assign({},P);
  if(!Q.leg2){const l=P.leg;Q.leg2=l.p?{p:[l.p[0]-5,l.p[1]-1],bend:l.bend,f:l.f}:Object.assign({},l);}
  if(!Q.arm2){const a=P.arm;Q.arm2=a.p?{p:[a.p[0]-5,a.p[1]-1],bend:a.bend}:Object.assign({},a);}
  return Q;}

/* Props are drawn in the figure's coordinates (viewBox 0 -24 240 224, ground at y 185). */
const PROPS={
 chair:`<g class="pr"><rect x="62" y="144" width="50" height="7" rx="2.5"/><rect x="62" y="88" width="6" height="60" rx="2.5"/><rect x="64" y="150" width="5" height="35" rx="1.5"/><rect x="104" y="150" width="5" height="35" rx="1.5"/></g>`,
 bench:`<g class="pr"><rect x="82" y="144" width="74" height="8" rx="3"/><rect x="88" y="151" width="6" height="34" rx="1.5"/><rect x="144" y="151" width="6" height="34" rx="1.5"/></g>`,
 pushbench:`<g class="pr"><rect x="150" y="149" width="70" height="8" rx="3"/><rect x="156" y="156" width="6" height="29" rx="1.5"/><rect x="208" y="156" width="6" height="29" rx="1.5"/></g>`,
 rowbench:`<g class="pr"><rect x="60" y="150" width="130" height="8" rx="3"/><rect x="70" y="157" width="6" height="28" rx="1.5"/><rect x="174" y="157" width="6" height="28" rx="1.5"/></g>`,
 step:`<g class="pr"><rect x="140" y="160" width="58" height="25" rx="4"/></g>`,
 wall:`<g class="pr"><rect x="172" y="-24" width="12" height="209"/></g>`,
 wall2:`<g class="pr"><rect x="150" y="-24" width="12" height="209"/></g>`,
 mat:`<g class="pr"><rect x="26" y="183" width="190" height="4" rx="2"/></g>`
};
/* dumbbells: "side" is seen end-on (a plate), "goblet" is held upright at the chest */
function dbHTML(kind){return kind==="goblet"?`<g class="db"><rect class="dbh" x="-2.6" y="-11" width="5.2" height="22" rx="2"/><rect class="dbp" x="-8" y="-15" width="16" height="7" rx="3"/><rect class="dbp" x="-8" y="8" width="16" height="7" rx="3"/></g>`:`<g class="db"><circle class="dbp" r="7.2"/><circle class="dbi" r="2.6"/></g>`;}

const EX=[
{id:"sts",n:"Sit-to-stand",pat:"Legs",eq:["body"],props:["chair"],work:["thigh"],
 one:"Stand up from a chair and sit back down with control. The foundation of leg strength, and the move behind getting out of a car, off the toilet or up from the floor.",
 m:{p:["quad","glute"],s:["adductor","calf"]},
 steps:["Sit near the front of a firm chair, feet hip-width apart and flat, a little behind your knees.","Cross your arms on your chest, or reach them forward.","Lean forward from the hips, nose over toes, then push through your whole foot to stand tall.","Sit back down slowly, reaching your hips back, and touch the seat lightly before the next one."],
 tips:["Breathe out as you stand.","Knees travel in line with your toes, not inwards.","Use your hands on the armrests if you need to at first."],
 easier:"Use a higher seat, or push off your thighs with your hands.",harder:"Use a lower seat, slow the lowering to 3 seconds, or hold a weight at your chest (goblet squat).",
 frames:[{hip:[94,138],to:68,ne:72,leg:{p:[126,180],bend:1,f:0},arm:{u:-4,l:2}},
         {hip:[106,124],to:50,ne:60,leg:{p:[126,180],bend:1,f:0},arm:{u:-14,l:-8}},
         {hip:[124,98],to:90,ne:90,leg:{p:[126,180],bend:1,f:0},arm:{u:-86,l:-84}}]},
{id:"goblet",n:"Goblet squat",pat:"Legs",eq:["db","gym"],work:["thigh"],hold:"goblet",
 one:"A squat holding one dumbbell or kettlebell at your chest. The weight in front helps you sit back and stay upright.",
 m:{p:["quad","glute"],s:["adductor","erector","abs"]},
 steps:["Hold one end of a dumbbell at your chest with both hands, elbows tucked in.","Stand with feet a little wider than hips, toes turned slightly out.","Sit down between your heels, keeping your chest up and your heels down.","Go as low as feels comfortable and controlled, then push the floor away to stand."],
 tips:["Breathe in on the way down and out on the way up.","Keep your knees in line with your toes.","Squatting to a chair or box teaches depth and adds a safety net."],
 easier:"Squat to a chair or box, or use a lighter weight.",harder:"Use a heavier weight, pause for 2 seconds at the bottom, or move to a barbell squat with coaching.",
 frames:[{hip:[120,98],to:88,ne:90,leg:{p:[124,180],bend:1,f:0},arm:{u:-56,l:96}},
         {hip:[98,136],to:58,ne:68,leg:{p:[124,180],bend:1,f:0},arm:{u:-50,l:92}}]},
{id:"bridge",n:"Glute bridge",pat:"Hips",eq:["body"],props:["mat"],work:["thigh"],
 one:"Lying on your back, lift your hips by squeezing your buttocks. A gentle start for the hip extensors that power walking, stairs and getting up.",
 m:{p:["glute"],s:["hamstring","erector"]},
 steps:["Lie on your back with knees bent, feet flat and hip-width apart, arms by your sides.","Breathe out, gently draw in your pelvic floor and lower tummy, and squeeze your buttocks.","Lift your hips until your body is in a straight line from shoulders to knees.","Pause, then lower slowly."],
 tips:["Push through your heels.","Don't arch your lower back at the top; stop when hips and thighs line up.","Keep breathing; don't hold your breath."],
 easier:"Make the lift smaller.",harder:"Hold a weight across your hips, pause for 3 seconds at the top, or do it on one leg.",
 frames:[{hip:[116,170],to:184,ne:182,leg:{p:[168,180],bend:1,f:0},arm:{u:-4,l:0}},
         {hip:[112,142],to:214,ne:186,leg:{p:[168,180],bend:1,f:0},arm:{u:-4,l:0}}]},
{id:"rdl",n:"Romanian deadlift",pat:"Hips",eq:["db","gym"],work:["thigh","trunk"],hold:"side",
 one:"A hip hinge: you bend at the hips with a long, straight back, lowering dumbbells down your thighs. Strengthens the back of the hips and thighs for lifting safely.",
 m:{p:["hamstring","glute"],s:["erector","forearm","trap"]},
 steps:["Stand tall holding dumbbells in front of your thighs, knees softly bent.","Push your hips back as if closing a car door with your bottom, letting the weights slide down your thighs.","Keep your back long and neck in line; stop when you feel a stretch behind your thighs, usually around the knees.","Drive your hips forward to stand tall again."],
 tips:["The movement comes from the hips, not from rounding the back.","Keep the weights close to your legs.","Practise first with a broomstick along your spine."],
 easier:"Practise the hinge with no weight, hands on your thighs.",harder:"Use heavier dumbbells, or a barbell with coaching.",
 frames:[{hip:[118,98],to:90,ne:90,leg:{p:[120,180],bend:1,f:0},arm:{u:-92,l:-90}},
         {hip:[102,104],to:26,ne:32,leg:{p:[120,180],bend:1,f:0},arm:{u:-90,l:-91}}]},
{id:"stepup",n:"Step-up",pat:"Legs",eq:["body","db","gym"],props:["step"],work:["thigh"],nearOnly:true,
 one:"Step up onto a sturdy step or box, then step back down. Builds single-leg strength and balance for stairs, kerbs and hills.",
 m:{p:["quad","glute"],s:["hamstring","calf","adductor"]},
 steps:["Stand facing a sturdy step, with a rail or wall nearby if you need it.","Place your whole foot on the step.","Press through that foot to stand up tall on the step, bringing the other foot up beside it.","Step down slowly with the same leg you lifted last, and repeat. Swap the leading leg each set."],
 tips:["Let the leg on the step do the work rather than pushing off the floor.","Keep your knee in line with your toes.","Start with a low step."],
 easier:"Use a lower step and hold a rail.",harder:"Use a higher step or hold dumbbells by your sides.",
 frames:[{hip:[118,98],to:87,ne:88,leg:{p:[160,154],bend:1,f:0},leg2:{p:[116,180],bend:1,f:0},arm:{u:-94,l:-88}},
         {hip:[140,80],to:84,ne:86,leg:{p:[160,154],bend:1,f:0},leg2:{p:[136,166],bend:1,f:-20},arm:{u:-96,l:-86}},
         {hip:[157,73],to:90,ne:90,leg:{p:[160,154],bend:1,f:0},leg2:{p:[153,153],bend:1,f:0},arm:{u:-92,l:-90}}]},
{id:"split",n:"Split squat",pat:"Legs",eq:["body","db","gym"],work:["thigh"],nearOnly:true,
 one:"With one foot forward and one back, lower your back knee towards the floor. Strengthens each leg on its own and challenges balance.",
 m:{p:["quad","glute"],s:["adductor","hamstring","calf"]},
 steps:["Take a long step forward. Keep both feet hip-width apart, as if on train tracks, and lift your back heel.","Hold a chair or wall if you need to.","Bend both knees to lower straight down, until your back knee hovers above the floor or as low as is comfortable.","Push through your front foot to rise. Finish all repetitions, then swap legs."],
 tips:["Keep your body upright, as if going down in a lift.","Your front knee can move forward over your toes; keep it in line with them.","Go only as low as you can control."],
 easier:"Make the movement smaller and hold a support.",harder:"Hold dumbbells, or raise the back foot on a low step.",
 frames:[{hip:[122,100],to:90,ne:90,leg:{p:[152,180],bend:1,f:0},leg2:{p:[90,174],bend:1,f:-38},arm:{u:-92,l:-90}},
         {hip:[118,132],to:88,ne:88,leg:{p:[152,180],bend:1,f:0},leg2:{p:[90,174],bend:1,f:-38},arm:{u:-92,l:-90}}]},
{id:"pushup",n:"Incline push-up",pat:"Push",eq:["body","db","gym"],props:["pushbench"],work:["uarm","farm"],nearOnly:true,
 one:"A push-up with your hands raised on a bench, bench top or wall. The higher your hands, the easier it is, so it suits every level.",
 m:{p:["pec","tricep","delt"],s:["abs"]},
 steps:["Place your hands on a sturdy bench or bench top, a little wider than your shoulders.","Walk your feet back until your body is in a straight line from head to heels.","Bend your elbows to lower your chest towards the edge, elbows angled back at about 45 degrees.","Push away until your arms are straight."],
 tips:["Keep your tummy and buttocks gently tight so your hips don't sag.","Breathe out as you push.","Lower the hand height over the weeks to make it harder."],
 easier:"Push from a wall.",harder:"Use a lower surface, then the floor on your knees, then full push-ups.",
 frames:[{hip:[127,126],to:39,ne:39,leg:{p:[63,178],bend:1,f:-55},arm:{p:[171,145],bend:-1}},
         {hip:[136,141],to:27,ne:30,leg:{p:[63,178],bend:1,f:-55},arm:{p:[171,145],bend:-1}}]},
{id:"press",n:"Seated shoulder press",pat:"Push",eq:["body","db","gym"],props:["bench"],work:["uarm"],hold:"side",
 one:"Sitting tall, press dumbbells (or a band) from shoulder height to overhead. Strengthens the shoulders and arms for reaching up and lifting things onto shelves.",
 m:{p:["delt","tricep"],s:["trap","abs"]},
 steps:["Sit tall on a bench or firm chair, feet flat.","Hold dumbbells at shoulder height, palms facing forward or facing each other.","Breathe out and press the weights up until your arms are nearly straight overhead.","Lower slowly back to shoulder height."],
 tips:["Keep your ribs down; don't lean back.","Press in a pain-free range. If overhead is uncomfortable, press up and slightly forward.","With a band, sit on the middle of it and press the handles up."],
 easier:"Use lighter weights, or press one arm at a time.",harder:"Use heavier weights or press standing.",
 frames:[{hip:[118,138],to:90,ne:90,leg:{p:[152,180],bend:1,f:0},arm:{u:-80,l:92}},
         {hip:[118,138],to:90,ne:90,leg:{p:[152,180],bend:1,f:0},arm:{u:86,l:89}}]},
{id:"row",n:"One-arm row",pat:"Pull",eq:["db","gym"],props:["rowbench"],work:["uarm","trunk"],hold:"side",nearOnly:true,
 one:"Supported on a bench, pull a dumbbell up towards your hip. Strengthens the upper back and arms for good posture, carrying and pulling.",
 m:{p:["lat","trap","rdelt"],s:["bicep","forearm"]},
 steps:["Put one hand and the same-side knee on a bench, the other foot on the floor.","Let the dumbbell hang from your free hand, back flat and neck long.","Pull the weight up towards your hip, leading with your elbow and drawing your shoulder blade back.","Lower slowly until your arm is straight. Finish all repetitions, then swap sides."],
 tips:["Keep your trunk still; don't twist to lift.","Think 'elbow to back pocket'.","With a band, sit with legs out, loop it round your feet and row both handles to your ribs."],
 easier:"Use a band row, or a lighter weight.",harder:"Use a heavier weight, or pause 2 seconds at the top.",
 frames:[{hip:[106,102],to:7,ne:12,leg:{p:[128,180],bend:1,f:0},leg2:{p:[66,144],bend:1,f:0},arm:{u:-90,l:-90},arm2:{p:[163,144],bend:-1}},
         {hip:[106,102],to:9,ne:12,leg:{p:[128,180],bend:1,f:0},leg2:{p:[66,144],bend:1,f:0},arm:{u:166,l:-96},arm2:{p:[163,144],bend:-1}}]},
{id:"bandrow",n:"Seated band row",pat:"Pull",eq:["body"],props:["mat"],work:["uarm","trunk"],band:true,
 one:"Sitting on the floor with a resistance band looped round your feet, pull the handles to your ribs. A home version of the row for the upper back and arms.",
 m:{p:["lat","trap","rdelt"],s:["bicep","forearm"]},
 steps:["Sit tall on the floor or a mat with legs out in front, knees slightly bent.","Loop the middle of a band round the soles of your feet and hold an end in each hand, arms reaching forward.","Pull your elbows back past your ribs, drawing your shoulder blades together.","Return slowly until your arms are straight."],
 tips:["Sit tall; don't lean back to finish the pull.","Keep your shoulders down, away from your ears.","Sitting on a folded towel or a step makes sitting tall easier."],
 easier:"Use a lighter band, or hold it further from the ends.",harder:"Use a heavier band, hold it shorter, or pause 2 seconds with elbows back.",
 frames:[{hip:[100,173],to:92,ne:92,leg:{p:[178,176],bend:1,f:78},arm:{u:4,l:2}},
         {hip:[100,173],to:94,ne:92,leg:{p:[178,176],bend:1,f:78},arm:{u:222,l:2}}]},
{id:"carry",n:"Farmer's carry",pat:"Carry",eq:["body","db","gym"],work:["farm"],hold:"side",cycle:true,
 one:"Walk tall holding a weight in each hand. Builds grip, shoulder and trunk strength and steady walking, as when carrying shopping.",
 m:{p:["forearm","trap"],s:["abs","oblique","glute","calf"]},
 steps:["Stand between two dumbbells, or full shopping bags or water bottles.","Hinge at the hips with a straight back to pick them up, then stand tall.","Walk with short, steady steps for 20 to 40 metres or 30 seconds, shoulders back and down.","Set the weights down the same careful way."],
 tips:["Don't let the weights pull you sideways or forwards.","Breathe normally.","Use a clear, flat path."],
 easier:"Use lighter weights or carry one at a time with a rest between.",harder:"Use heavier weights, walk further, or carry one weight on one side (a suitcase carry).",
 frames:[{hip:[119,99],to:90,ne:90,leg:{p:[138,180],bend:1,f:0},leg2:{p:[101,178],bend:1,f:-24},arm:{u:-88,l:-90},arm2:{u:-94,l:-90}},
         {hip:[121,96],to:90,ne:90,leg:{p:[124,180],bend:1,f:0},leg2:{p:[118,166],bend:1,f:-10},arm:{u:-90,l:-90},arm2:{u:-90,l:-90}},
         {hip:[119,99],to:90,ne:90,leg:{p:[101,178],bend:1,f:-24},leg2:{p:[138,180],bend:1,f:0},arm:{u:-94,l:-90},arm2:{u:-88,l:-90}},
         {hip:[121,96],to:90,ne:90,leg:{p:[118,166],bend:1,f:-10},leg2:{p:[124,180],bend:1,f:0},arm:{u:-90,l:-90},arm2:{u:-90,l:-90}}]},
{id:"calf",n:"Calf raise",pat:"Legs",eq:["body","db","gym"],props:["wall"],work:["shin"],
 one:"Rise up onto the balls of your feet and lower slowly. Strengthens the calves and ankles that push you forward when you walk and help you recover your balance.",
 m:{p:["calf"],s:[]},
 steps:["Stand tall facing a wall or bench top with your fingertips resting on it.","Rise up onto the balls of your feet as high as you can.","Pause for a moment.","Lower slowly, taking about 3 seconds."],
 tips:["Keep your weight over your big and second toes.","Stand on the edge of a step to work through a bigger range.","Breathe steadily."],
 easier:"Do a smaller rise with more support from your hands.",harder:"Do them on one leg, or hold a dumbbell.",
 frames:[{hip:[118,98],to:90,ne:90,leg:{p:[120,180],bend:1,f:0},arm:{p:[166,64],bend:-1},arm2:{u:-92,l:-90}},
         {hip:[123,87],to:90,ne:90,leg:{p:[125,168.5],bend:1,f:-50},arm:{p:[166,60],bend:-1},arm2:{u:-92,l:-90}}]},
{id:"deadbug",n:"Dead bug",pat:"Trunk",eq:["body"],props:["mat"],work:["trunk"],
 one:"Lying on your back, slowly reach one arm and the opposite leg away while keeping your trunk still. Trains the deep tummy muscles to control movement.",
 m:{p:["abs"],s:["oblique"]},
 steps:["Lie on your back with arms reaching to the ceiling and knees bent at 90 degrees over your hips.","Breathe out and gently draw in your lower tummy and pelvic floor, keeping your lower back resting towards the floor.","Slowly reach one arm overhead and straighten the opposite leg, only as far as you can keep your back still.","Return, and repeat on the other side."],
 tips:["Move slowly; control matters more than range.","Keep breathing.","If your back lifts, make the movement smaller."],
 easier:"Move only the legs, one at a time, with heels tapping the floor.",harder:"Move more slowly, or hold the reach for 3 seconds.",
 frames:[{hip:[124,174],to:180,ne:180,leg:{p:[164,133],bend:1,f:10},leg2:{p:[160,132],bend:1,f:10},arm:{u:90,l:90},arm2:{u:92,l:90}},
         {hip:[124,174],to:180,ne:180,leg:{p:[164,133],bend:1,f:10},leg2:{p:[200,164],bend:1,f:0},arm:{u:172,l:178},arm2:{u:92,l:90}}]},
{id:"balance",n:"Single-leg stand",pat:"Balance",eq:["body"],props:["wall2"],work:["thigh"],
 one:"Stand on one leg near a support. Balance training like this is a core part of programmes that prevent falls.",
 m:{p:["glute","calf"],s:["abs","quad"]},
 steps:["Stand side-on near a wall or bench top, close enough to touch it if you need to.","Shift your weight onto one leg and lift the other foot.","Stand tall and hold for up to 30 seconds, breathing normally.","Swap legs. Repeat 2 to 3 times each side."],
 tips:["Fix your eyes on a point ahead.","Use a fingertip on the wall rather than a firm grip.","Practise most days, for example while the kettle boils."],
 easier:"Stand with one foot in front of the other (heel to toe) instead.",harder:"Turn your head slowly, close your eyes briefly with support close by, or stand on a cushion.",
 frames:[{hip:[120,98],to:90,ne:90,leg:{p:[122,180],bend:1,f:0},leg2:{p:[116,180],bend:1,f:0},arm:{p:[146,88],bend:-1},arm2:{u:-92,l:-90}},
         {hip:[121,98],to:90,ne:90,leg:{p:[122,180],bend:1,f:0},leg2:{p:[134,146],bend:1,f:-8},arm:{p:[146,88],bend:-1},arm2:{u:-92,l:-90}}]}
];
const EXBY={};EX.forEach(e=>EXBY[e.id]=e);

/* ---------- Drawing ---------- */
const SVGNS="http://www.w3.org/2000/svg";
function figMarkup(ex,big){const props=(ex.props||[]).map(p=>PROPS[p]).join("");
  const seg=(cls,w)=>`<line class="${cls}" stroke-width="${w}"/>`;
  const limbs=(pfx,far)=>`<g class="lg ${far?"far":"near"}">${seg("sg th"+(ex.work.includes("thigh")?" wk":""),15)}${seg("sg sh"+(ex.work.includes("shin")?" wk":""),12)}${seg("sg ft",8)}</g>`;
  const arms=(far)=>`<g class="am ${far?"far":"near"}">${seg("sg ua"+(ex.work.includes("uarm")?" wk":""),10)}${seg("sg fa"+(ex.work.includes("farm")?" wk":""),8.5)}${ex.hold?`<g class="hold">${dbHTML(ex.hold)}</g>`:""}</g>`;
  const body=`<g class="bd">${arms(true)}${limbs("",true)}<line class="sg to${ex.work.includes("trunk")?" wk":""}" stroke-width="23"/><line class="sg nk" stroke-width="8"/>${limbs("",false)}<circle class="hair" r="5.5"/><circle class="hd" r="11"/>${arms(false)}</g>`;
  const bodyB=ex.band?`<line class="band"/>`+body:body;
  return `<line class="gnd" x1="4" x2="236" y1="${FIG.ground}" y2="${FIG.ground}"/>${props}<g class="ghost" aria-hidden="true">${bodyB}</g><g class="live">${bodyB}</g>`;}
function setLine(l,a,b){l.setAttribute("x1",a[0].toFixed(1));l.setAttribute("y1",a[1].toFixed(1));l.setAttribute("x2",b[0].toFixed(1));l.setAttribute("y2",b[1].toFixed(1));}
function drawPose(g,S,ex){const q=s=>g.querySelectorAll(s);
  const legs=q(".lg"),arms=q(".am");
  const L=[[legs[0],S.leg2],[legs[1],S.leg]],A=[[arms[0],S.arm2],[arms[1],S.arm]];
  L.forEach(([el,s])=>{if(!s)return;const ls=el.querySelectorAll("line");setLine(ls[0],s.a,s.b);setLine(ls[1],s.b,s.c);setLine(ls[2],s.c,s.d);});
  A.forEach(([el,s])=>{if(!s)return;const ls=el.querySelectorAll("line");setLine(ls[0],s.a,s.b);setLine(ls[1],s.b,s.c);const h=el.querySelector(".hold");
    if(h){let ox=0,oy=0;if(ex.hold==="goblet"){ox=5;oy=9;}h.setAttribute("transform",`translate(${(s.c[0]+ox).toFixed(1)} ${(s.c[1]+oy).toFixed(1)})`);}});
  const bd=g.querySelector(".band");if(bd&&S.leg.d){setLine(bd,[S.leg.d[0]-2,S.leg.d[1]+2],S.arm.c);}
  setLine(g.querySelector(".to"),S.hip,S.sh);
  const nkEnd=[S.sh[0]+(S.head[0]-S.sh[0])*.55,S.sh[1]+(S.head[1]-S.sh[1])*.55];setLine(g.querySelector(".nk"),S.sh,nkEnd);
  const hd=g.querySelector(".hd");hd.setAttribute("cx",S.head[0].toFixed(1));hd.setAttribute("cy",S.head[1].toFixed(1));
  /* a small bun at the back of the head */
  const ang=Math.atan2(S.head[1]-S.sh[1],S.head[0]-S.sh[0]);const back=ang-Math.PI*0.62;
  const hr=g.querySelector(".hair");hr.setAttribute("cx",(S.head[0]+Math.cos(back)*10.5).toFixed(1));hr.setAttribute("cy",(S.head[1]+Math.sin(back)*10.5).toFixed(1));}
function frameAt(ex,i){return solve(withFar(ex.frames[i]));}
function poseAt(ex,t){/* t from 0 to 1 over one full cycle */
  const F=ex.frames,n=F.length;
  if(ex.cycle){const x=t*n,i=Math.floor(x)%n,j=(i+1)%n,f=x-Math.floor(x);return solve(withFar(lerpPose(F[i],F[j],ease(f))));}
  /* ping-pong through the key positions, with short holds at each end */
  const up=.42,hold=.08,down=.42;let k;
  if(t<up)k=t/up;else if(t<up+hold)k=1;else if(t<up+hold+down)k=1-(t-up-hold)/down;else k=0;
  const e=ease(k)*(n-1),i=Math.min(n-2,Math.floor(e)),f=e-i;return solve(withFar(lerpPose(F[i],F[i+1],f)));}
function ease(x){return .5-.5*Math.cos(Math.PI*clamp(x,0,1));}

const FIGS=[];let figRaf=0,figLast=0;
function makeFig(host,ex,opts){opts=opts||{};const svg=D.createElementNS(SVGNS,"svg");svg.setAttribute("viewBox","0 -24 240 224");svg.setAttribute("class","fig-pose"+(opts.small?" sm":""));svg.setAttribute("role","img");
  svg.setAttribute("aria-label",ex.n+": figure showing the start and end positions");svg.innerHTML=figMarkup(ex);host.appendChild(svg);
  const f={svg,ex,t:0,vis:false,anim:!!opts.animate,host};
  drawPose(svg.querySelector(".ghost"),frameAt(ex,0),ex);
  drawPose(svg.querySelector(".live"),frameAt(ex,ex.cycle?0:ex.frames.length-1),ex);
  if(f.anim){FIGS.push(f);whenVisible(svg,v=>{f.vis=v;figSync();});}
  return f;}
function figSync(){const go=motionOK();FIGS.forEach(f=>{const on=go&&f.vis&&f.anim&&f.svg.isConnected;f.svg.classList.toggle("moving",on);if(!on){drawPose(f.svg.querySelector(".live"),frameAt(f.ex,f.ex.cycle?0:f.ex.frames.length-1),f.ex);}});
  const any=FIGS.some(f=>f.svg.classList.contains("moving"));if(any&&!figRaf){figLast=performance.now();figRaf=requestAnimationFrame(figLoop);}if(!any&&figRaf){cancelAnimationFrame(figRaf);figRaf=0;}}
function figLoop(now){const dt=Math.min(64,now-figLast);figLast=now;let any=false;
  FIGS.forEach(f=>{if(!f.svg.classList.contains("moving"))return;any=true;const dur=f.ex.cycle?2600:3800;f.t=(f.t+dt/dur)%1;drawPose(f.svg.querySelector(".live"),poseAt(f.ex,f.t),f.ex);});
  figRaf=any?requestAnimationFrame(figLoop):0;}
function dropFigs(root){for(let i=FIGS.length-1;i>=0;i--){if(!FIGS[i].svg.isConnected||(root&&root.contains(FIGS[i].svg)))FIGS.splice(i,1);}figSync();}
onMotion(figSync);
D.addEventListener("visibilitychange",()=>{if(D.hidden){if(figRaf){cancelAnimationFrame(figRaf);figRaf=0;}}else figSync();});
