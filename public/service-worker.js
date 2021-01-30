const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map((size) => `/icons/icon-${size}x${size}.png`);

const staticFilesToPreCache = [
    "/",
    "/index.html",
    "/style.css",
    "/index.js",
    "/manifest.json",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
].concat(iconFiles);

self.addEventListener("install", function (event) {
    event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        console.log("Files pre-cached successfully");
        return cache.addAll(staticFilesToPreCache);
    })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
        return Promise.all(
            keylist.map((key) => {
            if (key !== CACHE_NAME && KEY !== DATA_CACHE_NAME) {
                console.log("Removing old cache data", key);
                return caches.delete(key);
            }
            })
        );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    
    if (event.request.url.includes ("/api")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(res => {
                    if(res.status === 2000) {
                        cache.put(event.request, response.clone());
                    }
                    return res;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        ); 
        return;
    } event.respondWith(fetch(event.request).catch(function() { 
        return caches.match(event.request)
        .then(function(response){
            if (response) {return response}
            else if (event.request.headers.get("accept").includes("text/html")){
                return caches.match("/")
            }
        }); 
    })
);
})