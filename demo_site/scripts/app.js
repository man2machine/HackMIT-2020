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

var current_day = 0;
var p_date = new Date();
var current_hour = p_date.getHours();

var text_dates = ['9/7', '9/8', '9/9', '9/10', '9/11', '9/12', '9/13', '9/14'];

function add_visits_map() {
    map.addSource('visits_count', {
        type: 'geojson',
        data: '../resources/analytics_cache/09-16-2020-weekly-visit-counts-map.geojson'
    });

    map.addLayer({
        'id': 'heatmap',
        'type': 'circle',
        'source': 'visits_count',
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
                ["<", ['get', 'index'], -1],
            '#cccccc',
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

function get_locs_metadata(indices, on_success, model_forecast, single_hour) {
    var model_type;
    if (model_forecast) {
        model_type = "model";
    }
    else {
        model_type = "avg";
    }
    var forecast_hour = null;
    if (single_hour) {
        forecast_hour = current_hour;
    }
    console.log(JSON.stringify({ "query_type": "record_detailed_data", "indices": indices, "forecast_model": model_type, "forecast_hour": forecast_hour }));
    var response = $.ajax({
        url: 'http://localhost:5000/',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        crossDomain: true,
        cache: false,
        xhrFields: {
            withCredentials: false
        },
        data: JSON.stringify({ "query_type": "record_detailed_data", "indices": indices, "forecast_model": model_type, "forecast_hour": forecast_hour }),
        dataType: 'json',
        success: on_success
    });
}

var lower_line_layout = {
    height: 200,
    margin: {
        l: 1,
        r: 1,
        b: 1,
        t: 1,
        pad: 4
    }
};

var forecast_graph_elem = document.getElementById('forecast_graph');
var trace = {
    x: [],
    y: [],
    name: 'name',
    type: 'scatter'
};
Plotly.newPlot(forecast_graph_elem, [trace], lower_line_layout)

function show_forecast_graph(metadata) {
    var y_data_past = [];
    var i = current_hour;
    while (true) {
        if (i >= metadata.visits_by_each_hour.length) {
            break;
        }
        y_data_past.push(metadata.visits_by_each_hour[i]);
        i += 24;
    }
    var y_data_forecast = [];
    y_data_forecast.push(y_data_past[y_data_past.length - 1]);
    y_data_forecast.push(metadata.forecast_info)
    var trace1 = {
        x: text_dates.slice(0, 7),
        y: y_data_past,
        name: 'data',
        type: 'scatter'
    };
    var trace2 = {
        x: text_dates.slice(6, 8),
        y: y_data_forecast,
        name: 'forecast',
        type: 'scatter',
        color: 'lifeExp'
    };
    var layout = {
        height: 200,
        margin: {
            l: 30,
            r: 5,
            b: 30,
            t: 5,
            pad: 4
        },
    };
    var traces = [trace1, trace2];
    console.log(JSON.stringify(traces))
    Plotly.react(forecast_graph_elem, traces, layout);
}

// var hour_visit_graph_elem = document.getElementById('hour_visit_graph');
// var trace = {
//     x: [],
//     y: [],
//     name: 'name',
//     type: 'scatter'
// };
// Plotly.newPlot(hour_visit_graph_elem, [trace], lower_line_layout)

// function show_hour_visit_graph(metadata) {
//     var y_data = metadata.visits_by_each_hour;
//     var x_data = [];
//     for (var i = 0; i < metadata.visits_by_each_hour.length; i++) {
//         var day = Math.floor(i/24);
//         x_data.push(text_dates[day]+":"+JSON.stringify(i % 24));
//     }
//     var trace1 = {
//         x: x_data.slice(0, 6),
//         y: y_data,
//         name: 'data',
//         type: 'scatter'
//     };
//     var layout = {
//         height: 200,
//         margin: {
//             l: 30,
//             r: 5,
//             b: 30,
//             t: 5,
//             pad: 4
//         },
//     };
//     var traces = [trace1];
//     console.log(JSON.stringify(traces))
//     Plotly.react(hour_visit_graph_elem, traces, layout);
// }

var visit_graph_elem = document.getElementById('visit_graph');
var trace = {
    x: [],
    y: [],
    name: 'name',
    type: 'bar'
};
Plotly.newPlot(visit_graph_elem, [trace], lower_line_layout);

function show_visits_graph(metadata) {
    var y_data = metadata.visits_by_day;
    var colors = [];
    var pallete = ["#5b273d", "#f87e3d", "#ebd2a1", "#61c49a"];
    for (var i = 0; i < y_data.length; i++) {
        colors.push(pallete[i % 4]);
    }
    var trace1 = {
        x: text_dates.slice(0, 7),
        y: y_data,
        marker: {
            color: colors,
        },
        name: 'data',
        type: 'bar'
    };
    var layout = {
        height: 200,
        margin: {
            l: 30,
            r: 5,
            b: 30,
            t: 5,
            pad: 4
        },
    };
    var traces = [trace1];
    console.log(JSON.stringify(traces))
    Plotly.react(visit_graph_elem, traces, layout);
}

function get_nearest_locs_metadata(loc_metadata, on_success) {
    var category = null;
    if (false) {
        category = loc_metadata.top_category;
    }
    var response = $.ajax({
        url: 'http://localhost:5000/',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        crossDomain: true,
        cache: false,
        xhrFields: {
            withCredentials: false
        },
        data: JSON.stringify({ "query_type": "closest_locs",  "category": category, "latitude": loc_metadata.latitude, "longitude": loc_metadata.longitude, "return_metadata": true }),
        dataType: 'json',
        success: on_success
    });
}

function update_table(locs_metadatas) {
    $('#results-table-body').empty();
    for (var i = 0; i < 4; i++) {
        var entry = locs_metadatas["metadatas"][i];
        var index = locs_metadatas["indices"][i];
        var html = "";
        html += "<tr id=\"table_entry"+JSON.stringify(i)+"\">";
        html += "<td>"+entry.location_name+"</td>";
        html += "<td>"+entry.top_category+"</td>";
        html += "<td>"+entry.street_address+"</td>";
        html += "</tr>"
        $('#results-table-body').prepend(html);
    }
}

var cat_dwell_graph_elem = document.getElementById('category_dwell_graph');

$.getJSON("../resources/analytics_cache/09-16-2020-weekly-category-stats-short.json", function(data) {
    var categories = [];
    var times = [];
    var colors = [];
    var pallete = ["#5b273d", "#f87e3d", "#ebd2a1", "#61c49a"];
    var i = 0
    for (var key in data) {
        categories.push(key);
        times.push(data[key]["mean_median_dwell"]);
        colors.push(pallete[i % 4]);
        i++;
    }
    var layout = {
        height: 200,
        margin: {
            l: 30,
            r: 5,
            b: 30,
            t: 5,
            pad: 4
        },
        yaxis: {
            showticklabels: false
        },
        barmode: 'group'
    };
    var trace = {
        x: times,
        y: categories,
        text: categories,
        marker: {
            color: colors
        },
        name: 'name',
        type: 'bar',
        orientation: 'h'
    };
    Plotly.newPlot(cat_dwell_graph_elem, [trace], layout);
});

map.on('load', function () {
    add_visits_map();

    map.on('click', 'heatmap', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var properties = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        function on_success1(data) {
            console.log(JSON.stringify(data[0]))
            desc = "<strong>" + data[0].location_name + "</strong>";
            desc += "<p>";
            desc += data[0].street_address + ", " + data[0].city + ", " + data[0].region + ", " + data[0].postal_code;
            desc += "<br>";
            desc += "</p>";
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(desc)
                .addTo(map);
            show_forecast_graph(data[0]);
            show_visits_graph(data[0]);
            //show_hour_visit_graph(data[0]);

            function on_success2(locs_metadata) {
                console.log(JSON.stringify(locs_metadata));
                update_table(locs_metadata)
            }

            get_nearest_locs_metadata(data[0], on_success2);
        }
        get_locs_metadata([properties.index], on_success1, false, true);

        
    });
});
