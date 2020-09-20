function init_bar_graph(element) {
    var layout = { barmode: 'group' };
    var trace = {
        x: [],
        y: [],
        name: 'name',
        type: 'bar'
    };
    Plotly.newPlot(element, [trace], layout);
}

function update_bar_graph(element, traces) {
    var layout = { barmode: 'group' };
    Plotly.react(element, traces, layout);
}

function init_line_graph(element) {
    var layout = {
        height: 200,
        margin: {
            l: 1,
            r: 1,
            b: 1,
            t: 1,
            pad: 4
        }
    };
    var trace = {
        x: [],
        y: [],
        name: 'name',
        type: 'line'
    };
    Plotly.newPlot(element, [trace], layout)
}

function update_line_graph(element, traces) {
    var layout = {
        height: 200,
        margin: {
            l: 1,
            r: 1,
            b: 1,
            t: 1,
            pad: 4
        }
    };
    Plotly.react(element, traces, layout);
}

// var trace1 = {
//     x: ['giraffes', 'orangutans', 'monkeys'],
//     y: [20, 14, 23],
//     name: 'SF Zoo',
//     type: 'bar'
// };

// var trace2 = {
//     x: ['giraffes', 'orangutans', 'monkeys'],
//     y: [12, 18, 29],
//     name: 'LA Zoo',
//     type: 'bar'
// };

// var trace3 = {
//     x: [1, 2, 3],
//     y: [12, 18, 29],
//     name: 'LA Zoo',
//     type: 'bar'
// };

// TESTER = document.getElementById('tester');

// plot_empty_bar_graph(TESTER, []);
// plot_bar_graph(TESTER, [trace1, trace2]);

// init_line_graph(TESTER);
// update_line_graph(TESTER, [trace3]);