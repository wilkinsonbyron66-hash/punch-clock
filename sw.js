// Lets Punch Clock open even with a weak connection. Attendance itself is kept in the browser's storage.
const CACHE="punch-clock-v8";
const CORE=["./","index.html","config.js","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  // fresh copy when online, cached copy when offline
  e.respondWith(fetch(req).then(res=>{if(res&&res.status===200&&(req.url.startsWith(self.location.origin)||/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(req.url))){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res})
    .catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))));
});
