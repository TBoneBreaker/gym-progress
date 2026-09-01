(()=>{
  'use strict';

  const style=document.createElement('style');
  style.id='gym-v11-weight-chart-style';
  style.textContent=`
    #weightChart{width:100%!important;max-width:100%!important;overflow:hidden!important}
    #weightChart svg[data-patch-weight-chart]{display:block;width:100%!important;max-width:100%!important;height:auto!important;overflow:visible}
    #weightChart .patchChartEmpty{padding:30px;text-align:center;color:#7c887f;font-size:12px}
  `;
  document.head.appendChild(style);

  const KEY='gymProgressPWA_v1';

  function loadWeights(){
    try{
      const d=JSON.parse(localStorage.getItem(KEY))||{};
      return Array.isArray(d.weights)?d.weights.slice():[];
    }catch(e){return []}
  }

  function dateObj(s){return new Date(`${s}T12:00:00`)}
  function dateShort(s){
    const d=dateObj(s);
    return new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit'}).format(d);
  }
  function fmt(v){return Number(v).toLocaleString('de-DE',{maximumFractionDigits:1})}

  function visibleSevenDays(all){
    const sorted=all.filter(x=>x&&x.date&&Number.isFinite(+x.value)).sort((a,b)=>a.date.localeCompare(b.date));
    if(!sorted.length)return [];
    const latest=dateObj(sorted.at(-1).date);
    const cutoff=new Date(latest);
    cutoff.setDate(cutoff.getDate()-6);
    return sorted.filter(x=>dateObj(x.date)>=cutoff&&dateObj(x.date)<=latest);
  }

  function buildChart(points){
    if(!points.length)return '<div class="patchChartEmpty" data-patch-weight-chart>Keine Daten in den letzten 7 Tagen</div>';

    const W=390,H=280,L=42,R=22,T=30,B=44;
    const vals=points.map(x=>+x.value);
    let mn=Math.min(...vals),mx=Math.max(...vals);
    let span=Math.max(.6,mx-mn);
    let step=span<=2?.5:span<=5?1:2;
    mn=Math.floor((mn-step)/step)*step;
    mx=Math.ceil((mx+step)/step)*step;
    if(mx<=mn)mx=mn+step*2;

    const plotW=W-L-R;
    const x=i=>points.length===1?L+plotW/2:L+i*plotW/(points.length-1);
    const y=v=>T+(mx-v)/(mx-mn)*(H-T-B);

    let o=`<svg data-patch-weight-chart viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Körpergewicht der letzten sieben Tage">`;
    for(let v=mn;v<=mx+.001;v+=step){
      const yy=y(v);
      o+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e4eae3" stroke-width="1"/>`;
      o+=`<text x="${L-7}" y="${yy+4}" text-anchor="end" font-size="10" fill="#7f8a82">${fmt(v)}</text>`;
    }
    if(points.length>1){
      o+=`<polyline points="${points.map((e,i)=>`${x(i)},${y(+e.value)}`).join(' ')}" fill="none" stroke="#52b966" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    points.forEach((e,i)=>{
      const xx=x(i),yy=y(+e.value);
      const labelY=yy<48?yy+23:yy-11;
      o+=`<circle cx="${xx}" cy="${yy}" r="5" fill="#63db78" stroke="#fff" stroke-width="2"/>`;
      o+=`<text x="${xx}" y="${labelY}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#263229">${fmt(+e.value)} kg</text>`;
      o+=`<text x="${xx}" y="${H-16}" text-anchor="middle" font-size="9" fill="#7d8880">${dateShort(e.date)}</text>`;
    });
    o+='</svg>';
    return o;
  }

  function enhanceWeightChart(){
    const chart=document.getElementById('weightChart');
    if(!chart)return;
    const points=visibleSevenDays(loadWeights());
    const signature=points.map(x=>`${x.date}:${x.value}`).join('|');
    const patched=chart.querySelector('[data-patch-weight-chart]');
    if(patched&&chart.dataset.patchSevenSig===signature)return;
    chart.dataset.patchSevenSig=signature;
    chart.innerHTML=buildChart(points);
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;enhanceWeightChart()});
  }

  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('storage',schedule);
  window.addEventListener('resize',schedule);
  schedule();
})();
