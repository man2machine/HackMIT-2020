mapboxgl.accessToken = 'pk.eyJ1IjoicGVyc29uMTI3IiwiYSI6ImNrZmE2bWI2eTB0NXQydG83bXVwempsa3IifQ.jv4_i_eXbKFqpLZuc19S9w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-71.0057, 42.3601], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
map.dragPan.enable();

map.on('load', function () {
    map.addSource('test', {
        type: 'geojson',
        data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
    });

    map.addLayer({
        'id': 'heatmap',
        'type': 'circle',
        'source': 'test',
        'paint': {
            'circle-radius': {
                'base': 1.75,
                'stops': [
                    [12, 5],
                    [22, 20]
                ]
            },
            'circle-color': [
                'match',
                ['get', 'scalerank'],
                7,
                '#fbb03b',
                8,
                '#223b53',
                '#3bb2d0'
            ]
        }
    });
});