(()=>{
  'use strict';

  const KEY='gymProgressPWA_v1';
  const style=document.createElement('style');
  style.id='gym-v14-style';
  style.textContent=`
    .set{grid-template-columns:24px minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important}
    .inputStep{grid-template-columns:32px minmax(64px,1fr) 32px!important;gap:4px!important}
    .inputStep input{min-width:0!important;padding-left:1px!important;padding-right:1px!important;font-size:16px!important;font-variant-numeric:tabular-nums!important}
    .inputStep .step{padding:0 1px!important;font-size:8px!important;white-space:nowrap!important}
    .workout.open{background:linear-gradient(180deg,#fff,#fff0f0)!important;border-color:#efb9b9!important}
    .workout.open .state{background:#ffe0e0!important;color:#a33d3d!important}
    .workout.progress{background:linear-gradient(180deg,#fffdf8,#fff3cf)!important;border-color:#e8cc79!important}
    .workout.done{background:linear-gradient(180deg,#f3fff5,#e3f7e7)!important;border-color:#8ed69b!important}
    .patchJumpWrap{margin-top:13px;padding-top:12px;border-top:1px solid rgba(110,125,114,.12)}
    .patchJumpLabel{font-size:11px;color:#7c887f;font-weight:800;margin:0 2px 7px}
    .patchJumpStrip{display:flex;gap:7px;overflow-x:auto;padding:1px 2px 8px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .patchJumpStrip::-webkit-scrollbar{display:none}
    .patchJumpBtn{flex:0 0 auto;max-width:190px;border:1px solid #efb9b9;background:#fff0f0;color:#8d3a3a;border-radius:14px;padding:9px 11px;font-size:11px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;touch-action:manipulation}
    .patchJumpBtn.progress{background:#fff3cf;border-color:#e8cc79;color:#88610c}
    .patchJumpBtn.done{background:#e8f8eb;border-color:#9cdda8;color:#26743a}
    .patchJumpBtn:active{transform:scale(.96)}
    .workout{scroll-margin-top:105px}
    .workout.patchFlash{animation:patchFlash .6s ease}
    @keyframes patchFlash{0%{box-shadow:0 0 0 0 rgba(111,85,205,.30)}45%{box-shadow:0 0 0 7px rgba(111,85,205,.13)}100%{box-shadow:0 12px 34px rgba(38,65,44,.07)}}
    .patchBodyWeightStep{display:grid;grid-template-columns:58px minmax(0,1fr) 58px;gap:8px;align-items:stretch}
    .patchBodyWeightStep .patchBwBtn{border:1px solid #bedcf7;background:#edf6ff;color:#3375a7;border-radius:13px;font-size:11px;font-weight:850;touch-action:manipulation}
    .patchBodyWeightStep .patchBwBtn:active{transform:scale(.96)}
    .patchBodyWeightStep #weightInput{font-size:20px!important;padding:11px 4px!important;text-align:center!important;font-variant-numeric:tabular-nums}
    .nutritionFields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
    .nutritionField{border-radius:16px;padding:11px;border:1px solid}
    .nutritionField.cal{background:#fff4e8;border-color:#efc79c}
    .nutritionField.steps{background:#f3efff;border-color:#d4c4f3}
    .nutritionField label{margin:0 0 7px!important;font-size:11px!important}
    .nutritionField input{background:rgba(255,255,255,.9)!important}
    .nutritionSummary{margin-top:12px;padding:14px;background:linear-gradient(145deg,#fff,#f7f4ff);border-color:#d8c8f7}
    .nutritionSummaryTitle{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
    .nutritionSummaryTitle b{font-size:16px}
    .quality{font-size:10px;font-weight:850;border-radius:999px;padding:5px 8px;background:#f2f4f2;color:#6e786f}
    .quality.good{background:#e8f8eb;color:#26743a}.quality.mid{background:#fff3cf;color:#88610c}
    .nutritionMetrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .nMetric{border:1px solid #ece8f4;background:#fff;border-radius:14px;padding:10px}
    .nMetric span{display:block;color:#7c887f;font-size:10px;font-weight:760;margin-bottom:4px}
    .nMetric strong{font-size:17px;letter-spacing:-.02em}
    .nutritionHint{font-size:10px;color:#7c887f;line-height:1.4;margin-top:9px}
    .nutritionMeta{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}
    .nutritionChip{font-size:9.5px;font-weight:800;padding:4px 6px;border-radius:999px}
    .nutritionChip.cal{background:#fff0dc;color:#a76518}.nutritionChip.steps{background:#eee7ff;color:#6e4aa2}
    #weightChart{width:100%!important;max-width:100%!important;overflow:hidden!important}
    #weightChart svg[data-v14-chart]{display:block;width:100%!important;max-width:100%!important;height:auto!important;overflow:hidden!important}
    .chartLegend{display:flex;gap:12px;flex-wrap:wrap;padding:8px 4px 0;font-size:10px;font-weight:800;color:#69746c}
    .legendDot{display:inline-block;width:8px;height:8px;border-radius:999px;margin-right:4px;vertical-align:0}
    @media(max-width:390px){.nutritionFields{grid-template-columns:1fr}.nutritionMetrics{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  function load(){
    try{return JSON.parse(localStorage.getItem(KEY))||{weights:[]}}catch(e){return {weights:[]}}
  }
  function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
  function entries(){
    const d=load();
    return (Array.isArray(d.weights)?d.weights:[]).filter(x=>x&&x.date&&Number.isFinite(+x.value)).sort((a,b)=>a.date.localeCompare(b.date));
  }
  const fmt=(v,d=1)=>Number(v).toLocaleString('de-DE',{maximumFractionDigits:d});
  const shortDate=s=>new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit'}).format(new Date(`${s}T12:00:00`));

  function cardState(card){
    if(card.classList.contains('done'))return 'done';
    if(card.classList.contains('progress'))return 'progress';
    return 'open';
  }
  function jumpTo(card){
    if(!card)return;
    card.scrollIntoView({behavior:'smooth',block:'start'});
    card.classList.remove('patchFlash');
    void card.offsetWidth;
    card.classList.add('patchFlash');
    setTimeout(()=>card.classList.remove('patchFlash'),700);
  }
  function enhanceTraining(){
    const root=document.getElementById('trainingRoot');
    if(!root)return;
    const head=root.querySelector('.workoutHead');
    const cards=[...root.querySelectorAll('.workout[data-card]')];
    if(!head||!cards.length)return;
    const signature=cards.map(c=>`${c.dataset.card}:${cardState(c)}:${c.querySelector('h3')?.textContent||''}`).join('|');
    let wrap=head.querySelector('.patchJumpWrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='patchJumpWrap';
      wrap.innerHTML='<div class="patchJumpLabel">Übung direkt auswählen</div><div class="patchJumpStrip"></div>';
      head.appendChild(wrap);
    }
    if(wrap.dataset.signature===signature)return;
    wrap.dataset.signature=signature;
    const strip=wrap.querySelector('.patchJumpStrip');
    strip.innerHTML='';
    cards.slice().sort((a,b)=>(+a.dataset.order||0)-(+b.dataset.order||0)).forEach(card=>{
      const btn=document.createElement('button');
      btn.type='button';
      const s=cardState(card);
      btn.className=`patchJumpBtn ${s==='open'?'':s}`;
      btn.textContent=card.querySelector('h3')?.textContent?.trim()||'Übung';
      btn.addEventListener('click',()=>jumpTo(card));
      strip.appendChild(btn);
    });
  }

  function metadataFor(date){return entries().find(x=>x.date===date)||null}
  function fillNutritionFields(){
    const date=document.getElementById('weightDate')?.value;
    if(!date)return;
    const e=metadataFor(date);
    const cal=document.getElementById('calorieInput'),steps=document.getElementById('stepsInput');
    if(cal)cal.value=e?.calories??'';
    if(steps)steps.value=e?.steps??'';
  }
  function enhanceWeightModal(){
    const input=document.getElementById('weightInput');
    if(!input)return;
    if(!input.closest('.patchBodyWeightStep')){
      const wrapper=document.createElement('div');
      wrapper.className='patchBodyWeightStep';
      const minus=document.createElement('button');
      minus.type='button';minus.className='patchBwBtn';minus.textContent='−0,1';
      const plus=document.createElement('button');
      plus.type='button';plus.className='patchBwBtn';plus.textContent='+0,1';
      input.parentNode.insertBefore(wrapper,input);
      wrapper.append(minus,input,plus);
      const change=delta=>{
        let v=parseFloat(String(input.value).replace(',','.'));
        if(!Number.isFinite(v)){
          const txt=document.getElementById('weightNow')?.textContent||document.getElementById('homeWeight')?.textContent||'';
          v=parseFloat(txt.replace(',','.'))||0;
        }
        input.value=(Math.max(0,Math.round((v+delta)*10)/10)).toFixed(1).replace('.0','');
        input.dispatchEvent(new Event('input',{bubbles:true}));
      };
      minus.addEventListener('click',()=>change(-.1));
      plus.addEventListener('click',()=>change(.1));
    }

    const sheet=input.closest('.sheet');
    if(sheet&&!sheet.querySelector('.nutritionFields')){
      const fields=document.createElement('div');
      fields.className='nutritionFields';
      fields.innerHTML=`<div class="nutritionField cal"><label>Kalorien gegessen</label><input id="calorieInput" type="number" min="0" step="10" inputmode="numeric" placeholder="z. B. 3000"></div><div class="nutritionField steps"><label>Schritte</label><input id="stepsInput" type="number" min="0" step="100" inputmode="numeric" placeholder="z. B. 10000"></div>`;
      const saveBtn=document.getElementById('saveWeight');
      sheet.insertBefore(fields,saveBtn);
      const title=sheet.querySelector('h3');
      if(title)title.textContent='Tagesdaten eintragen';
    }

    const date=document.getElementById('weightDate');
    if(date&&!date.dataset.v14){
      date.dataset.v14='1';
      date.addEventListener('change',fillNutritionFields);
    }
    const add=document.getElementById('addWeight');
    if(add&&!add.dataset.v14){
      add.dataset.v14='1';
      add.addEventListener('click',()=>setTimeout(()=>{
        const txt=document.getElementById('weightNow')?.textContent||'';
        if(input.value===''){
          const v=parseFloat(txt.replace(',','.'));
          if(Number.isFinite(v))input.value=String(v);
        }
        fillNutritionFields();
      },0));
    }
    const saveBtn=document.getElementById('saveWeight');
    if(saveBtn&&!saveBtn.dataset.v14){
      saveBtn.dataset.v14='1';
      saveBtn.addEventListener('click',()=>{
        const dateVal=document.getElementById('weightDate')?.value;
        const calVal=parseInt(document.getElementById('calorieInput')?.value||'',10);
        const stepVal=parseInt(document.getElementById('stepsInput')?.value||'',10);
        setTimeout(()=>{
          if(!dateVal)return;
          const d=load();
          d.weights=Array.isArray(d.weights)?d.weights:[];
          const row=d.weights.find(x=>x.date===dateVal);
          if(row){
            if(Number.isFinite(calVal)&&calVal>0)row.calories=calVal;else delete row.calories;
            if(Number.isFinite(stepVal)&&stepVal>=0)row.steps=stepVal;else delete row.steps;
            save(d);
            schedule();
          }
        },0);
      });
    }
  }

  function scale(values,minY,maxY,pad=.08){
    const finite=values.filter(Number.isFinite);
    if(!finite.length)return ()=>maxY;
    let mn=Math.min(...finite),mx=Math.max(...finite);
    if(mx===mn){mn-=1;mx+=1}
    const extra=(mx-mn)*pad;
    mn-=extra;mx+=extra;
    return v=>maxY-(v-mn)/(mx-mn)*(maxY-minY);
  }
  function poly(points,getY,getVal,x){
    const valid=points.map((e,i)=>({e,i,v:getVal(e)})).filter(p=>Number.isFinite(p.v));
    if(valid.length<2)return '';
    return `<polyline points="${valid.map(p=>`${x(p.i)},${getY(p.v)}`).join(' ')}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function buildCombinedChart(points){
    if(!points.length)return '<div data-v14-chart style="padding:30px;text-align:center;color:#7c887f;font-size:12px">Noch keine Daten</div>';
    const W=390,H=350,L=42,R=24,X0=L+6,X1=W-R-6;
    const x=i=>points.length===1?(X0+X1)/2:X0+i*(X1-X0)/(points.length-1);
    const wVals=points.map(e=>+e.value),cVals=points.map(e=>Number(e.calories)),sVals=points.map(e=>Number(e.steps));
    const yW=scale(wVals,42,116),yC=scale(cVals.filter(v=>v>0),150,214),yS=scale(sVals.filter(v=>v>=0),244,306);
    let o=`<div class="chartLegend" data-v14-legend><span><i class="legendDot" style="background:#52b966"></i>Gewicht</span><span><i class="legendDot" style="background:#e99a3d"></i>Kalorien</span><span><i class="legendDot" style="background:#8a68d1"></i>Schritte</span></div>`;
    o+=`<svg data-v14-chart viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gewicht, Kalorien und Schritte der letzten sieben Tage">`;
    [['Gewicht',34,'#e8f5ea'],['Kalorien',142,'#fff5e9'],['Schritte',236,'#f5f1ff']].forEach(([name,y,bg])=>{
      o+=`<rect x="${L}" y="${y}" width="${W-L-R}" height="86" rx="12" fill="${bg}"/>`;
      o+=`<text x="${L+8}" y="${y+14}" font-size="9" font-weight="800" fill="#6d776f">${name}</text>`;
    });
    o+=`<g style="color:#52b966">${poly(points,yW,e=>+e.value,x)}</g>`;
    o+=`<g style="color:#e99a3d">${poly(points,yC,e=>Number(e.calories)>0?Number(e.calories):NaN,x)}</g>`;
    o+=`<g style="color:#8a68d1">${poly(points,yS,e=>Number.isFinite(Number(e.steps))?Number(e.steps):NaN,x)}</g>`;
    points.forEach((e,i)=>{
      const xx=x(i),wv=+e.value,cv=Number(e.calories),sv=Number(e.steps);
      if(Number.isFinite(wv)){
        const yy=yW(wv);o+=`<circle cx="${xx}" cy="${yy}" r="4.6" fill="#52b966" stroke="#fff" stroke-width="2"/><text x="${xx}" y="${Math.max(48,yy-9)}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#2c5133">${fmt(wv,1)}</text>`;
      }
      if(Number.isFinite(cv)&&cv>0){
        const yy=yC(cv);o+=`<circle cx="${xx}" cy="${yy}" r="4.2" fill="#e99a3d" stroke="#fff" stroke-width="2"/><text x="${xx}" y="${Math.max(156,yy-8)}" text-anchor="middle" font-size="8" font-weight="800" fill="#8a5418">${Math.round(cv)}</text>`;
      }
      if(Number.isFinite(sv)&&sv>=0){
        const yy=yS(sv),lab=sv>=1000?`${fmt(sv/1000,1)}k`:String(Math.round(sv));
        o+=`<circle cx="${xx}" cy="${yy}" r="4.2" fill="#8a68d1" stroke="#fff" stroke-width="2"/><text x="${xx}" y="${Math.max(250,yy-8)}" text-anchor="middle" font-size="8" font-weight="800" fill="#5d4792">${lab}</text>`;
      }
      o+=`<text x="${xx}" y="${H-12}" text-anchor="middle" font-size="8.5" fill="#7d8880">${shortDate(e.date)}</text>`;
    });
    return o+'</svg>';
  }

  function regressionSlope(rows){
    if(rows.length<2)return 0;
    const t0=new Date(`${rows[0].date}T12:00:00`).getTime();
    const pts=rows.map(r=>({x:(new Date(`${r.date}T12:00:00`).getTime()-t0)/86400000,y:+r.value}));
    const mx=pts.reduce((a,p)=>a+p.x,0)/pts.length,my=pts.reduce((a,p)=>a+p.y,0)/pts.length;
    const num=pts.reduce((a,p)=>a+(p.x-mx)*(p.y-my),0),den=pts.reduce((a,p)=>a+(p.x-mx)*(p.x-mx),0);
    return den?num/den:0;
  }
  function analysis(){
    const rows=entries().filter(e=>Number.isFinite(+e.calories)&&+e.calories>0);
    const recent=rows.slice(-21);
    if(recent.length<7)return {enough:false,count:recent.length};
    const slope=regressionSlope(recent);
    const avgCal=recent.reduce((a,e)=>a+(+e.calories),0)/recent.length;
    const withSteps=recent.filter(e=>Number.isFinite(+e.steps));
    const avgSteps=withSteps.length?withSteps.reduce((a,e)=>a+(+e.steps),0)/withSteps.length:null;
    const maintenance=avgCal-slope*7700;
    const weekly=slope*7;
    return {enough:true,count:recent.length,maintenance,weekly,avgCal,avgSteps,bulk:maintenance+200,quality:recent.length>=14?'good':'mid'};
  }
  function renderSummary(){
    const weight=document.getElementById('weight');
    if(!weight)return;
    let box=weight.querySelector('#nutritionSummary');
    if(!box){
      box=document.createElement('div');
      box.id='nutritionSummary';box.className='card nutritionSummary';
      const firstSection=weight.querySelector('.section');
      if(firstSection)weight.insertBefore(box,firstSection);else weight.appendChild(box);
    }
    const a=analysis();
    if(!a.enough){
      box.innerHTML=`<div class="nutritionSummaryTitle"><b>Erhaltungsbedarf</b><span class="quality">${a.count}/7 Tage</span></div><div class="nutritionHint">Trage mindestens 7 Tage Gewicht und Kalorien ein. Ab 14 vollständigen Tagen wird die Schätzung deutlich brauchbarer. Schritte werden als Aktivitäts-Kontext mitgeführt.</div>`;
      return;
    }
    const q=a.quality==='good'?'Gute Datenbasis':'Vorläufig';
    box.innerHTML=`<div class="nutritionSummaryTitle"><b>Kalorienanalyse</b><span class="quality ${a.quality}">${q}</span></div><div class="nutritionMetrics"><div class="nMetric"><span>Geschätzter Erhalt</span><strong>${Math.round(a.maintenance)} kcal</strong></div><div class="nMetric"><span>Aufbau +200</span><strong>${Math.round(a.bulk)} kcal</strong></div><div class="nMetric"><span>Gewichtstrend</span><strong>${a.weekly>=0?'+':''}${fmt(a.weekly,2)} kg/W</strong></div><div class="nMetric"><span>Ø Schritte</span><strong>${a.avgSteps==null?'–':Math.round(a.avgSteps).toLocaleString('de-DE')}</strong></div></div><div class="nutritionHint">Schätzung aus deiner durchschnittlichen Kalorienzufuhr und dem Gewichtstrend der letzten ${a.count} vollständigen Tage. Wasser, Salz und Glykogen können den Wert kurzfristig deutlich verzerren.</div>`;
  }

  function renderGraph(){
    const chart=document.getElementById('weightChart');
    if(!chart)return;
    const p=entries().slice(-7);
    const sig=p.map(e=>`${e.date}:${e.value}:${e.calories??''}:${e.steps??''}`).join('|');
    if(chart.dataset.v14sig===sig&&chart.querySelector('[data-v14-chart]'))return;
    chart.dataset.v14sig=sig;
    chart.innerHTML=buildCombinedChart(p);
  }
  function enhanceHistory(){
    const root=document.getElementById('weightHistory');
    if(!root)return;
    const rows=[...root.querySelectorAll('.hist')];
    const dataRows=entries().slice().reverse();
    rows.forEach((row,i)=>{
      const e=dataRows[i];if(!e)return;
      const first=row.firstElementChild;if(!first)return;
      let meta=first.querySelector('.nutritionMeta');
      const sig=`${e.calories??''}:${e.steps??''}`;
      if(meta?.dataset.sig===sig)return;
      if(!meta){meta=document.createElement('div');meta.className='nutritionMeta';first.appendChild(meta)}
      meta.dataset.sig=sig;meta.innerHTML='';
      if(Number.isFinite(+e.calories))meta.innerHTML+=`<span class="nutritionChip cal">${Math.round(+e.calories)} kcal</span>`;
      if(Number.isFinite(+e.steps))meta.innerHTML+=`<span class="nutritionChip steps">${Math.round(+e.steps).toLocaleString('de-DE')} Schritte</span>`;
    });
  }

  let scheduled=false;
  function enhance(){
    scheduled=false;
    enhanceTraining();
    enhanceWeightModal();
    renderGraph();
    renderSummary();
    enhanceHistory();
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',schedule);
  window.addEventListener('storage',schedule);
  schedule();
})();