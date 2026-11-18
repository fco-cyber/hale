/* ---------- Muscle map: front and back, with the main muscles and helpers for an exercise ----------
   Shapes are drawn for the right half of each body, as offsets from the midline, then mirrored. */
const MNAME={quad:"Quadriceps (front of thigh)",glute:"Gluteals (buttocks)",hamstring:"Hamstrings (back of thigh)",adductor:"Adductors (inner thigh)",calf:"Calves",abs:"Abdominals (front of tummy)",oblique:"Obliques (sides of tummy)",erector:"Back extensors (along the spine)",pec:"Chest (pectorals)",delt:"Shoulders (front and side deltoids)",rdelt:"Rear shoulders (rear deltoids)",trap:"Trapezius (upper back and neck)",lat:"Latissimus dorsi (sides of the back)",bicep:"Biceps (front of upper arm)",tricep:"Triceps (back of upper arm)",forearm:"Forearms and grip"};
const MSHAPES={
 front:{
  trap:"M6 38C10 43 18 46 26 48L24 51C17 50 10 47 6 44Z",
  delt:"M24 50C32 48 39 54 40 63C40 70 38 76 36 80C33 72 29 64 23 58Z",
  pec:"M1 52L22 52C28 58 31 64 31 70C26 76 16 79 6 78C2 76 1 70 1 52Z",
  bicep:"M31 74C36 78 39 86 39 96C37 100 34 101 32 98C30 90 30 82 31 74Z",
  forearm:"M34 104C39 106 43 114 45 126C46 132 45 136 43 138C40 128 37 118 35 110Z",
  abs:"M1 82L10 82C11 94 11 108 10 122C7 126 4 128 1 128Z",
  oblique:"M12 82C18 84 21 94 21 104C21 112 18 120 13 124C13 110 13 96 12 82Z",
  quad:"M5 134C12 128 22 128 26 136C28 150 26 164 22 174C18 178 13 178 11 172C9 160 6 148 5 134Z",
  adductor:"M1 138C3 136 5 138 6 142C7 152 9 160 10 166C6 160 3 152 1 140Z",
  shin:"M12 186C17 186 21 192 21 202C20 210 19 216 17 220L12 220C11 208 11 196 12 186Z"},
 back:{
  trap:"M0 38L6 38C10 44 20 48 28 50C22 56 14 64 8 76L0 96Z",
  rdelt:"M26 50C34 49 40 55 40 64C40 70 38 76 36 79C33 70 29 62 22 56Z",
  lat:"M10 72C16 64 24 62 30 68C30 82 26 96 18 108L6 114C7 100 8 86 10 72Z",
  erector:"M1 98L6 96C7 108 7 118 6 128L1 128Z",
  tricep:"M31 72C37 76 40 86 39 98C36 102 33 101 31 97C29 88 29 80 31 72Z",
  forearm:"M34 104C39 106 43 114 45 126C46 132 45 136 43 138C40 128 37 118 35 110Z",
  glute:"M1 128C8 124 20 124 26 132C28 142 24 152 14 154C8 154 2 152 1 146Z",
  hamstring:"M5 158C12 155 22 156 25 162C26 170 23 178 19 182C14 182 9 178 7 172Z",
  calf:"M11 188C17 186 22 192 22 202C21 210 18 216 15 219C12 212 10 200 11 188Z"}
};
const SIL="M0 34L6 35L7 44C14 47 22 48 28 50C36 51 40 58 40 66C41 78 43 90 44 100C46 112 48 126 48 138C49 146 50 152 48 158C45 162 41 158 40 150C40 144 40 140 39 136C37 124 34 112 33 102C32 92 31 80 30 70L26 66C24 76 23 88 22 98C22 106 24 116 27 128C29 144 28 160 25 176C24 190 24 204 21 218C22 226 26 232 24 236L10 236C9 230 10 224 10 218C9 206 8 192 8 180C7 166 5 150 2 138L0 136Z";
const SIL_EDGE="M0 34L6 35L7 44C14 47 22 48 28 50C36 51 40 58 40 66C41 78 43 90 44 100C46 112 48 126 48 138C49 146 50 152 48 158C45 162 41 158 40 150C40 144 40 140 39 136C37 124 34 112 33 102C32 92 31 80 30 70L26 66C24 76 23 88 22 98C22 106 24 116 27 128C29 144 28 160 25 176C24 190 24 204 21 218C22 226 26 232 24 236L10 236C9 230 10 224 10 218C9 206 8 192 8 180C7 166 5 150 2 138L0 136";
function mmSide(cx,which,P,S){const sh=MSHAPES[which];const half=(flip)=>`<g transform="translate(${cx} 0)${flip?" scale(-1 1)":""}"><path class="mm-sil" d="${SIL}"/><path class="mm-edge" d="${SIL_EDGE}"/>${Object.keys(sh).map(k=>`<path class="mm-m${P.includes(k)?" p":S.includes(k)?" s":""}" d="${sh[k]}"/>`).join("")}${which==="front"?`<path class="mm-line" d="M2 92H10M2 102H10M2 112H10"/>`:""}</g>`;
  return half(false)+half(true)+`<ellipse class="mm-head" cx="${cx}" cy="20" rx="13" ry="16"/><text class="mm-lab" x="${cx}" y="252" text-anchor="middle">${which==="front"?"Front":"Back"}</text>`;}
function muscleMap(ex){const P=ex.m.p,S=ex.m.s;
  return `<svg class="mmap" viewBox="0 0 280 260" role="img" aria-label="Muscle map for ${ex.n}. Main muscles: ${P.map(k=>MNAME[k]).join(", ")}.${S.length?" Helpers: "+S.map(k=>MNAME[k]).join(", ")+".":""}">${mmSide(70,"front",P,S)}${mmSide(210,"back",P,S)}</svg>`;}
function muscleList(ex){return `<ul class="mm-key"><li><span class="sw p" aria-hidden="true"></span><span><b>Main muscles:</b> ${ex.m.p.map(k=>MNAME[k]).join(", ")}</span></li>${ex.m.s.length?`<li><span class="sw s" aria-hidden="true"></span><span><b>Helpers:</b> ${ex.m.s.map(k=>MNAME[k]).join(", ")}</span></li>`:""}</ul>`;}
