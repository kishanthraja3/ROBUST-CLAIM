// src/components/charts/Charts.jsx
// Canvas chart components — no external library needed.
import { useEffect, useRef } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DPR = () => window.devicePixelRatio || 1;

function setup(canvas, w, h) {
  const dpr = DPR();
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);     ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

// ── Donut ─────────────────────────────────────────────────────
export function DonutChart({ data, total }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const W = el.parentElement.offsetWidth || 260;
    const H = 200;
    const ctx = setup(el, W, H);
    const cx=W/2, cy=H/2, OR=Math.min(cx,cy)-10, IR=OR*.58;
    const colors = ['#16A34A','#D97706','#EA580C','#DC2626'];
    const vals = [data.LOW, data.MEDIUM, data.HIGH, data.VERY_HIGH];
    const sum = vals.reduce((a,b)=>a+b,1);
    let a = -Math.PI/2;
    vals.forEach((v,i)=>{
      const sw = (v/sum)*2*Math.PI;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,OR,a,a+sw); ctx.closePath();
      ctx.fillStyle = colors[i]; ctx.fill();
      a += sw;
    });
    // hole
    ctx.beginPath(); ctx.arc(cx,cy,IR,0,2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    // centre text
    ctx.fillStyle='#111827'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font=`700 ${Math.round(OR*.38)}px Inter,sans-serif`;
    ctx.fillText(total.toLocaleString(), cx, cy-8);
    ctx.font=`500 ${Math.round(OR*.18)}px Inter,sans-serif`;
    ctx.fillStyle='#6B7280';
    ctx.fillText('Total Claims', cx, cy+12);
  }, [data, total]);
  return <canvas ref={ref} />;
}

// ── Bar Chart ─────────────────────────────────────────────────
export function BarChart({ labels, values, colorFn }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const W = el.parentElement.offsetWidth || 360;
    const H = 170;
    const pl=34,pr=10,pt=12,pb=26;
    const ctx = setup(el, W, H);
    const cW=W-pl-pr, cH=H-pt-pb;
    const max = Math.max(...values,1);
    const bW = Math.max(8,(cW/values.length)*.55);
    const gap = cW/values.length;
    for(let i=0;i<=4;i++){
      const y=pt+cH-(i/4)*cH;
      ctx.beginPath(); ctx.moveTo(pl,y); ctx.lineTo(pl+cW,y);
      ctx.strokeStyle='#F3F4F6'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='10px Inter,sans-serif';
      ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(Math.round((i/4)*max), pl-4, y);
    }
    values.forEach((v,i)=>{
      const bH=(v/max)*cH;
      const x=pl+i*gap+(gap-bW)/2, y=pt+cH-bH;
      const color = colorFn ? colorFn(i,v) : '#4F46E5';
      const g=ctx.createLinearGradient(0,y,0,y+bH);
      g.addColorStop(0, color); g.addColorStop(1, color+'55');
      ctx.fillStyle=g;
      rr(ctx,x,y,bW,bH,3); ctx.fill();
      ctx.fillStyle='#9CA3AF'; ctx.font='10px Inter,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(labels[i], x+bW/2, pt+cH+4);
    });
  }, [labels, values, colorFn]);
  return <canvas ref={ref} />;
}

// ── Line Trend ────────────────────────────────────────────────
export function LineChart({ labels, datasets }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const W = el.parentElement.offsetWidth || 360;
    const H = 155;
    const pl=36,pr=12,pt=12,pb=26;
    const ctx = setup(el, W, H);
    const cW=W-pl-pr, cH=H-pt-pb;
    const all = datasets.flatMap(d=>d.values);
    const max = Math.max(...all,1);
    for(let i=0;i<=4;i++){
      const y=pt+cH-(i/4)*cH;
      ctx.beginPath(); ctx.moveTo(pl,y); ctx.lineTo(pl+cW,y);
      ctx.strokeStyle='#F3F4F6'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='10px Inter,sans-serif';
      ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(Math.round((i/4)*max), pl-4, y);
    }
    datasets.forEach(ds=>{
      const pts = ds.values.map((v,i)=>({
        x: pl+(i/(labels.length-1))*cW,
        y: pt+cH-(v/max)*cH
      }));
      const ag = ctx.createLinearGradient(0,pt,0,pt+cH);
      ag.addColorStop(0, ds.color+'25'); ag.addColorStop(1, ds.color+'00');
      ctx.beginPath(); ctx.moveTo(pts[0].x, pt+cH);
      pts.forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.lineTo(pts.at(-1).x, pt+cH); ctx.closePath();
      ctx.fillStyle=ag; ctx.fill();
      ctx.beginPath();
      pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
      ctx.strokeStyle=ds.color; ctx.lineWidth=2; ctx.lineJoin='round'; ctx.lineCap='round';
      ctx.stroke();
      pts.forEach(p=>{
        ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fillStyle=ds.color; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
        ctx.fillStyle='#fff'; ctx.fill();
      });
    });
    labels.forEach((l,i)=>{
      const x=pl+(i/(labels.length-1))*cW;
      ctx.fillStyle='#9CA3AF'; ctx.font='10px Inter,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(l, x, pt+cH+4);
    });
  }, [labels, datasets]);
  return <canvas ref={ref} />;
}

// ── Horizontal Bar ────────────────────────────────────────────
export function HorizBar({ items }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const W = el.parentElement.offsetWidth || 280;
    const rowH = 34;
    const H = items.length * rowH + 8;
    const pl=58,pr=48,pt=4;
    const ctx = setup(el, W, H);
    const cW = W-pl-pr;
    const max = Math.max(...items.map(d=>d.value),1);
    items.forEach((item,i)=>{
      const y = pt+i*rowH;
      const bW = (item.value/max)*cW;
      ctx.fillStyle='#9CA3AF'; ctx.font='600 11px Inter,sans-serif';
      ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(item.label, pl-8, y+rowH/2);
      ctx.fillStyle='#F3F4F6'; rr(ctx,pl,y+10,cW,12,3); ctx.fill();
      const g=ctx.createLinearGradient(pl,0,pl+bW,0);
      g.addColorStop(0,item.color); g.addColorStop(1,item.color+'99');
      ctx.fillStyle=g; rr(ctx,pl,y+10,bW,12,3); ctx.fill();
      ctx.fillStyle=item.color; ctx.font='600 11px Inter,sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(item.value.toLocaleString(), pl+bW+8, y+rowH/2);
    });
  }, [items]);
  return <canvas ref={ref} />;
}

// ── Gauge ─────────────────────────────────────────────────────
export function GaugeChart({ score }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current || score == null) return;
    const W=220, H=125;
    const ctx = setup(ref.current, W, H);
    const cx=W/2, cy=H-14, R=88, tw=13;
    const sA=Math.PI, eA=2*Math.PI;
    const pA=sA+(score/100)*Math.PI;
    let color = '#16A34A';
    if (score>=25) color='#D97706';
    if (score>=50) color='#EA580C';
    if (score>=75) color='#DC2626';
    ctx.beginPath(); ctx.arc(cx,cy,R,sA,eA);
    ctx.strokeStyle='#F3F4F6'; ctx.lineWidth=tw; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,R,sA,pA);
    ctx.strokeStyle=color; ctx.lineWidth=tw; ctx.lineCap='round'; ctx.stroke();
    for(let a=0;a<=180;a+=30){
      const rad=(a+180)*Math.PI/180;
      const ix=cx+(R-18)*Math.cos(rad), iy=cy+(R-18)*Math.sin(rad);
      const ox=cx+(R-7)*Math.cos(rad), oy=cy+(R-7)*Math.sin(rad);
      ctx.beginPath(); ctx.moveTo(ix,iy); ctx.lineTo(ox,oy);
      ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1.5; ctx.stroke();
    }
    ctx.fillStyle='#9CA3AF'; ctx.font='500 9px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('0',cx-R+4,cy+13);
    ctx.fillText('50',cx,cy-R-5);
    ctx.fillText('100',cx+R-4,cy+13);
  }, [score]);
  return <canvas ref={ref} />;
}
