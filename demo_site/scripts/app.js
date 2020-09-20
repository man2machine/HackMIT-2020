mapboxgl.accessToken = 'pk.eyJ1IjoicGVyc29uMTI3IiwiYSI6ImNrZmE2bWI2eTB0NXQydG83bXVwempsa3IifQ.jv4_i_eXbKFqpLZuc19S9w';

var green_red_colormap = ['#69B34C', '#ACB334', '#FAB733', '#FF8E15', '#FF4E11', '#FF0D0D'];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-71.0057, 42.3601], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
map.dragPan.enable();

function add_visits_map() {
    map.addSource('test', {
        type: 'geojson',
        data: '../resources/analytics_cache/09-16-2020-weekly-visit-counts.geojson'
    });

    map.addLayer({
        'id': 'heatmap',
        'type': 'circle',
        'source': 'test',
        'paint': {
            'circle-radius': {
                'base': 1.75,
                'stops': [
                    [12, 2],
                    [22, 10]
                ]
            },
            // https://www.schemecolor.com/red-orange-green-gradient.php
            'circle-color': [
                'case',
                [">", ['get', 'week_visits'], 50],
                green_red_colormap[5],
                [">", ['get', 'week_visits'], 40],
                green_red_colormap[4],
                [">", ['get', 'week_visits'], 30],
                green_red_colormap[3],
                [">", ['get', 'week_visits'], 20],
                green_red_colormap[2],
                [">", ['get', 'week_visits'], 10],
                green_red_colormap[1],
                [">", ['get', 'week_visits'], 0],
                green_red_colormap[0],
                '#cccccc'
            ]
        }
    });
}

map.on('load', function () {
    add_visits_map();
});