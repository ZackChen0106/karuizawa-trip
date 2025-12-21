self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('karuizawa-v1').then(function (cache) {
      return cache.addAll([
        'index.html',
        'flight.html',
        'itinerary.html',
        'hotel.html',
        'packing.html',
        'emergency.html',
        'style.css'
      ]);
    })
  );
});
