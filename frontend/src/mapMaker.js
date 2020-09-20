export const green_red_colormap = [
  "#69B34C",
  "#ACB334",
  "#FAB733",
  "#FF8E15",
  "#FF4E11",
  "#FF0D0D",
];

export const add_visits_map = (map, green_red_colormap) => {
  map.addSource("test", {
    type: "geojson",
    data: "09-16-2020-weekly-visit-counts-map.geojson",
  });

  map.addLayer({
    id: "heatmap",
    type: "circle",
    source: "test",
    paint: {
      "circle-radius": {
        base: 1.75,
        stops: [
          [12, 2],
          [22, 10],
        ],
      },
      // https://www.schemecolor.com/red-orange-green-gradient.php
      "circle-color": [
        "case",
        [">", ["get", "week_visits"], 50],
        green_red_colormap[5],
        [">", ["get", "week_visits"], 40],
        green_red_colormap[4],
        [">", ["get", "week_visits"], 30],
        green_red_colormap[3],
        [">", ["get", "week_visits"], 20],
        green_red_colormap[2],
        [">", ["get", "week_visits"], 10],
        green_red_colormap[1],
        [">", ["get", "week_visits"], 0],
        green_red_colormap[0],
        "#cccccc",
      ],
    },
  });
}
