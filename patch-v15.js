(()=>{
  'use strict';
  const KEY='gymProgressPWA_v1',NUT='gymProgressNutrition_v1';
  const proto=Storage.prototype,realSet=proto.setItem,realGet=proto.getItem;
  function readNutrition(){try{return JSON.parse(realGet.call(localStorage,NUT))||{}}catch(e){return {}}}
  function syncFromBase(){
    let d;try{d=JSON.parse(realGet.call(localStorage,KEY))||{}}catch(e){return}
    const n=readNutrition();
    for(const w of (Array.isArray(d.weights)?d.weights:[])){
      if(!w?.date)continue;
      if(w.calories!=null||w.steps!=null){
        n[w.date]=n[w.date]||{};
        if(w.calories!=null)n[w.date].calories=w.calories;
        if(w.steps!=null)n[w.date].steps=w.steps;
      }
    }
    realSet.call(localStorage,NUT,JSON.stringify(n));
  }
  syncFromBase();
  proto.setItem=function(key,value){
    if(this!==localStorage||key!==KEY)return realSet.call(this,key,value);
    try{
      const d=JSON.parse(String(value)),n=readNutrition();
      if(Array.isArray(d?.weights)){
        const dates=new Set();
        for(const w of d.weights){
          if(!w?.date)continue;dates.add(w.date);
          n[w.date]=n[w.date]||{};
          if(w.calories!=null)n[w.date].calories=w.calories;
          else if(n[w.date].calories!=null)w.calories=n[w.date].calories;
          if(w.steps!=null)n[w.date].steps=w.steps;
          else if(n[w.date].steps!=null)w.steps=n[w.date].steps;
        }
        for(const date of Object.keys(n))if(!dates.has(date))delete n[date];
        realSet.call(localStorage,NUT,JSON.stringify(n));
        return realSet.call(this,key,JSON.stringify(d));
      }
    }catch(e){}
    return realSet.call(this,key,value);
  };
})();