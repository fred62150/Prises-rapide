var V='prise-rapide-v13';
self.addEventListener('push',function(e){
  var d={};
  try{d=e.data.json()}catch(x){d={title:'Rappel',body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'Rappel',{body:d.body||'',tag:d.tag||'rappel',icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'./'}}));
});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
    for(var i=0;i<l.length;i++){if('focus' in l[i])return l[i].focus()}
    return self.clients.openWindow(url);
  }));
});
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin){
    if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
      e.respondWith(caches.open(V).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(res){c.put(r,res.clone());return res}).catch(function(){return m})})}));
    }
    return;
  }
  e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));
});
