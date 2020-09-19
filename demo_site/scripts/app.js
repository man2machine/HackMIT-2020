mapboxgl.accessToken = 'pk.eyJ1IjoiZGlzYXN0ZXJtYXBoYWNrcyIsImEiOiJjazBrY3h4MGIwZ2t1M2dvdGZ6N3JwYnYxIn0.Fj-Rv_ZqAbB0YvJfkwTjVw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-71.0057, 42.3601], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
map.dragPan.enable();