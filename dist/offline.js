'use strict';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 e.respondWith(fetch(r).catch(async()=>{if(!await caches.has('cardia-atlas-offline-v3'))return Response.error();const c=await caches.open('cardia-atlas-offline-v3');return await c.match(r)||(r.mode==='navigate'?await c.match(new URL('index.html',self.registration.scope)):null)||Response.error()}));
});
