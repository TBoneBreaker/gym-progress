(()=>{
  'use strict';

  const style=document.createElement('style');
  style.id='gym-v10-patch-style';
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
  `;
  document.head.appendChild(style);

  function cardState(card){
    if(card.classList.contains('done')) return 'done';
    if(card.classList.contains('progress')) return 'progress';
    return 'open';
  }

  function jumpTo(card){
    if(!card) return;
    card.scrollIntoView({behavior:'smooth',block:'start'});
    card.classList.remove('patchFlash');
    void card.offsetWidth;
    card.classList.add('patchFlash');
    setTimeout(()=>card.classList.remove('patchFlash'),700);
  }

  function enhanceTraining(){
    const root=document.getElementById('trainingRoot');
    if(!root) return;
    const head=root.querySelector('.workoutHead');
    const cards=[...root.querySelectorAll('.workout[data-card]')];
    if(!head||!cards.length) return;
    const signature=cards.map(c=>`${c.dataset.card}:${cardState(c)}:${c.querySelector('h3')?.textContent||''}`).join('|');
    let wrap=head.querySelector('.patchJumpWrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='patchJumpWrap';
      wrap.innerHTML='<div class="patchJumpLabel">Übung direkt auswählen</div><div class="patchJumpStrip"></div>';
      head.appendChild(wrap);
    }
    if(wrap.dataset.signature===signature) return;
    wrap.dataset.signature=signature;
    const strip=wrap.querySelector('.patchJumpStrip');
    strip.innerHTML='';
    cards.slice().sort((a,b)=>(+a.dataset.order||0)-(+b.dataset.order||0)).forEach(card=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className=`patchJumpBtn ${cardState(card)==='open'?'':cardState(card)}`;
      btn.textContent=card.querySelector('h3')?.textContent?.trim()||'Übung';
      btn.addEventListener('click',()=>jumpTo(card));
      strip.appendChild(btn);
    });
  }

  function enhanceWeightModal(){
    const input=document.getElementById('weightInput');
    if(!input||input.closest('.patchBodyWeightStep')) return;
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
    const add=document.getElementById('addWeight');
    if(add&&!add.dataset.patchPrefill){
      add.dataset.patchPrefill='1';
      add.addEventListener('click',()=>setTimeout(()=>{
        if(input.value!=='') return;
        const txt=document.getElementById('weightNow')?.textContent||document.getElementById('homeWeight')?.textContent||'';
        const v=parseFloat(txt.replace(',','.'));
        if(Number.isFinite(v)) input.value=String(v);
      },0));
    }
  }

  let scheduled=false;
  function enhance(){scheduled=false;enhanceTraining();enhanceWeightModal()}
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  schedule();
})();
