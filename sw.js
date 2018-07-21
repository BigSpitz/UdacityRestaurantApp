//declaring our cache and local cache files
var staticCacheName = 'restapp-static-v1';

var cacheFiles = [
  './css/styles.css',
  './index.html',
  './restaurant.html',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
  './data/restaurants.json',
  './js/dbhelper.js',
  './js/main.js',
  './js/restaurant_info.js'
]
//caching local files before sw starts
self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});


//the following code was influenced by a youtube video https://www.youtube.com/watch?v=BfL3pprhnms
//in the bits of code channel



self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request).then(function(response) {
      //check if fetch requests something already in cache
      if (response) {
        console.log('found in cache!!', response);
        return response;
      }
      return fetch(event.request)
        //if it is not in cache
        .then(function(response) {
          if (!response) {
            console.log("No fetch response ")
            return response;
          }
          var responseClone = response.clone();
          //we cache the request in our static cache (restapp-static-v1)
          caches.open(staticCacheName).then(function(cache) {
            cache.put(event.request, responseClone);
            //Very handy console.log for checking what is being cached
            console.log('New Data Cached', event.request.url);
            return response;
          });
          //in the end we let the request through
        }).then(function(response) {
          return fetch(event.request);
        });

    })
  );
});
