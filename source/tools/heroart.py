#!/usr/bin/env python3
"""Generate the hero artwork for Hale: a muscle belly running into its tendon, cut across at the right
to show its bundles of fibres (fascicles). Deterministic, so builds are repeatable."""
import math, random
def build():
    rnd=random.Random(7)
    cx,cy,rx,ry=252,142,64,102
    out=[]
    out.append('<svg class="hx" viewBox="30 0 330 300" aria-hidden="true" focusable="false">')
    out.append('<defs><radialGradient id="hxG"><stop offset="0" style="stop-color:var(--eosin);stop-opacity:.38"/><stop offset=".6" style="stop-color:var(--violet);stop-opacity:.1"/><stop offset="1" style="stop-color:var(--violet);stop-opacity:0"/></radialGradient>'
               '<linearGradient id="hxB" x1="0" y1="1" x2="1" y2="0"><stop offset="0" style="stop-color:var(--haem);stop-opacity:.05"/><stop offset=".55" style="stop-color:var(--violet);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--eosin);stop-opacity:.34"/></linearGradient></defs>')
    out.append(f'<circle class="hx-glow" cx="{cx}" cy="{cy}" r="150" fill="url(#hxG)"/>')
    # tendon and belly
    tip=(46,214)
    out.append('<path class="hx-tendon" d="M-30 262C0 246 22 230 46 214"/>')
    belly=f'M{tip[0]} {tip[1]}C78 170 150 50 {cx} {cy-ry}A{rx} {ry} 0 0 0 {cx} {cy+ry}C160 248 92 236 {tip[0]} {tip[1]}Z'
    out.append(f'<path class="hx-belly" d="{belly}" fill="url(#hxB)"/>')
    # fibres converge on the tendon
    fib=[];flow=[]
    N=17
    for k in range(N):
        th=math.radians(100+160*k/(N-1))
        ex,ey=cx+rx*math.cos(th)*0.98,cy-ry*math.sin(th)*0.98
        sx,sy=tip[0]+rnd.uniform(-3,3)+8,tip[1]+rnd.uniform(-4,4)-4
        c1x,c1y=sx+(ex-sx)*0.35,sy+(ey-sy)*0.15
        c2x,c2y=sx+(ex-sx)*0.7,ey+(sy-ey)*0.05
        d=f'M{sx:.1f} {sy:.1f}C{c1x:.1f} {c1y:.1f} {c2x:.1f} {c2y:.1f} {ex:.1f} {ey:.1f}'
        fib.append(f'<path d="{d}"/>')
        if k%3==1: flow.append(f'<path d="{d}"/>')
    out.append('<g class="hx-fib">'+''.join(fib)+'</g>')
    out.append('<g class="hx-flow">'+''.join(flow)+'</g>')
    # the cut face with fascicles packed inside
    out.append(f'<ellipse class="hx-cut" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>')
    circles=[]
    tries=0
    while tries<6000 and len(circles)<40:
        tries+=1
        r=rnd.uniform(10.5,17.5) if len(circles)<26 else rnd.uniform(7,11)
        x=rnd.uniform(cx-rx,cx+rx); y=rnd.uniform(cy-ry,cy+ry)
        # inside ellipse with margin
        if ((x-cx)/(rx-r-3))**2+((y-cy)/(ry-r-3))**2>1: continue
        if any(math.hypot(x-a,y-b)<r+c+2.2 for a,b,c in circles): continue
        circles.append((x,y,r))
    fas=[]
    for (x,y,r) in circles:
        dots=[]
        s=4.6
        rows=int(r*2/s)+2
        for i in range(-rows,rows+1):
            for j in range(-rows,rows+1):
                px=x+(j+0.5*(i%2))*s; py=y+i*s*0.866
                if math.hypot(px-x,py-y)<r-2.6: dots.append(f'<circle class="hx-fb" cx="{px:.1f}" cy="{py:.1f}" r="1.55"/>')
        fas.append(f'<g><circle class="hx-fas" cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}"/>{"".join(dots)}</g>')
    # put fascicle circles first so the breathing animation selectors (nth-of-type) vary
    out.append('<g class="hx-fasg">'+''.join(fas)+'</g>')
    out.append('</svg>')
    return ''.join(out)
if __name__=='__main__':
    s=build(); print(len(s)); import os; open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','heroart.svg'),'w').write(s)
