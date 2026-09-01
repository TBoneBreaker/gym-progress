const CACHE="gym-progress-v10";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-512.png","./patch-v10.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function documentResponse(request){
  let response;
  try{
    response=await fetch(request);
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(request,copy));
  }catch(e){
    response=await caches.match(request)||await caches.match("./index.html");
  }
  if(!response)return response;
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  let html=await response.text();
  if(!html.includes("patch-v10.js"))html=html.replace("</body>",'<script src="./patch-v10.js"></script></body>');
  const headers=new Headers(response.headers);headers.delete("content-length");headers.set("content-type","text/html; charset=utf-8");
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){e.respondWith(documentResponse(e.request));return;}
  e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match(e.request)));
});
