/**
 * Created by mnecas on 08/07/17.
 */
var dateAfterClick;
var typeAfterClick;
var weekAfterClick;

function perMonth() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Closed at');
    data.addColumn('number', 'Count of prs in month');
    data.addColumn('number', 'Average');
    data.addColumn('number', 'Hours');
    data.addRows(get_time_per_month(data_fromDatabase));


    var options = {
        legend: "top",
        height: 400,
        //isStacked: true,
        title: "Per months",
        bar: {groupWidth: "100%"},
        hAxis: {
            format: 'M/yyyy',
            gridlines: {count: get_count_of_months(data_fromDatabase)}
        }, animation: {
            startup: true,
            duration: 1500,
            easing: 'out'
        },
        vAxis: {
            logScale: true,
            scaleType: "mirrorLog",
            title: 'Hours'
        }
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
        dateAfterClick = data.getValue(chart.getSelection()[0].row, 0);
        if (window.location.pathname !== "/") {
            typeAfterClick = "issue";
            window.location.replace("../info?date=" + dateAfterClick + "&id=" + typeAfterClick);
        }
        else {
            typeAfterClick = "pr";
            window.location.replace("/info?date=" + dateAfterClick + "&id=" + typeAfterClick);
        }
    }
}
function timelineOfMerges() {
    var container = document.getElementById('chart_div10');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({type: 'string', id: 'Name'});
    dataTable.addColumn({type: 'string', id: 'How many closed PRs'});
    dataTable.addColumn({type: 'date', id: 'Start'});
    dataTable.addColumn({type: 'date', id: 'End'});
    var data = get_merged_by_user(data_fromDatabase);
    var addToRows = [];
    for (var i = 0; i < data.length; i++) {
        var pole = data[i];
        for (var ch = 0; ch < pole[1].length; ch += 2) {
            addToRows.push([pole[1][ch], "" + pole[1][ch + 1], new Date(data[i][0].getYear() + 1900, data[i][0].getMonth()), new Date(data[i][0].getYear() + 1900, data[i][0].getMonth() + 1)]);
        }
    }

    var options = {
        height: 500,
        //isStacked: true,get_all_users(data_fromDatabase).length * 46
        timeline: {colorByRowLabel: true},
        title: "Per month",
        bar: {groupWidth: "100%"},
        hAxis: {
            format: 'M/yyyy',
            gridlines: {count: get_count_of_months(data_fromDatabase)}
        }, animation: {
            startup: true,
            duration: 1500,
            easing: 'out'
        },
        vAxis: {
            logScale: true,
            scaleType: "mirrorLog",
            title: 'Hours'
        }
    };
    dataTable.addRows(addToRows);

    chart.draw(dataTable, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
        user = dataTable.getValue(chart.getSelection()[0].row, 0);
        dateAfterClick = dataTable.getValue(chart.getSelection()[0].row, 2);

        if (window.location.pathname !== "/") {
            typeAfterClick = "issue";
            window.location.replace("../info?date=" + dateAfterClick + "&id=" + typeAfterClick + "&user=" + user);
        }
        else {
            typeAfterClick = "pr";
            window.location.replace("/info?date=" + dateAfterClick + "&id=" + typeAfterClick + "&user=" + user);
        }
    }
}
function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'MERGED_AT');
    data.addColumn('number', 'ID');
    data.addColumn('number', 'HOURS');
    data.addColumn('string', 'TITLE');
    data.addRows(get_all_info_about_usersIn_month(data_fromDatabase, date));
    var cssClassNames = {
        'headerRow': 'headerChar'
    };
    var options = {
        alternatingRowStyle: false,
        width: "80%",
        'cssClassNames': cssClassNames
    };

    var table = new google.visualization.Table(document.getElementById('information'));

    table.draw(data, options);


    google.visualization.events.addListener(table, 'select', selectHandler);

    function selectHandler(e) {
        click = data.getValue(table.getSelection()[0].row, 1);
        if (id === "pr") {
            window.open("https://github.com/" + githubUser + "/" + githubRepo + "/pull/" + click);
        } else {
            window.open("https://github.com/" + githubUser + "/" + githubRepo + "/issues/" + click);
        }
    }
}
function bySpeedWITHDATE() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'week number');
    data.addColumn('number', '0-3h');
    data.addColumn('number', '3-12h');
    data.addColumn('number', '12-24h');
    data.addColumn('number', '1-2d');
    data.addColumn('number', '2-7d');
    data.addColumn('number', '7-14d');
    data.addColumn('number', '14-30d');
    data.addColumn('number', '30+d');
    data.addRows(get_data_by_speed_to_graphWITHDATE(data_fromDatabase, date));


    var options = {
        legend: "top",
        height: 400,
        //isStacked: true,f
        title: "Weeks",
        bar: {groupWidth: "90%"},
        colors: ['#009900', '#00cc00', '#99ff33', '#ffff00', '#ff9933', '#ff6600', '#ff5050', '#ff0000'],
        hAxis: {
        }, animation: {
            startup: true,
            duration: 1500,
            easing: 'out'
        },
        vAxis: {
            logScale: true,
            scaleType: "mirrorLog",
            title: 'Hours'
        }
    };


    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div80'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
        window.location.replace(window.location.href+ "&week=" + data.getValue(chart.getSelection()[0].row, 0));
    }
}
function bySpeedWITHDAY() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'week number');
    data.addColumn('number', 'Time to merge');
    data.addColumn({ type: 'string', role: 'style' });
    data.addRows(get_info_by_how_long_before_mergedINWEEK(data_fromDatabase, date,week));


    var options = {
        legend: "top",
        height: 400,
        isStacked: true,
        title: "Weeks",
        bar: {groupWidth: "80%"},
        hAxis: {
        }, animation: {
            startup: true,
            duration: 1500,
            easing: 'out'
        },
        vAxis: {
            logScale: true,
            scaleType: "mirrorLog",
            title: 'Hours'
        }
    };


    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div80'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
            click = data.getValue(table.getSelection()[0].row, 4);
        if (id === "pr") {
            window.open("https://github.com/" + githubUser + "/" + githubRepo + "/pull/" + click);
        } else {
            window.open("https://github.com/" + githubUser + "/" + githubRepo + "/issues/" + click);
        }
    }
}
function bySpeed() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Closed at');
    data.addColumn('number', '0-3h');
    data.addColumn('number', '3-12h');
    data.addColumn('number', '12-24h');
    data.addColumn('number', '1-2d');
    data.addColumn('number', '2-7d');
    data.addColumn('number', '7-14d');
    data.addColumn('number', '14-30d');
    data.addColumn('number', '30+d');
    data.addRows(get_data_by_speed_to_graph(data_fromDatabase));


    var options = {
        legend: "top",
        height: 400,
        //isStacked: true,
        title: "Per one month",
        bar: {groupWidth: "80%"},
        colors: ['#009f00', '#00bf00', '#94cb2e', '#e4d500', '#ff9933', '#ff6600', '#ff1e00', '#c60000'],
        hAxis: {
            format: 'M/yyyy'
        }, animation: {
            startup: true,
            duration: 1500,
            easing: 'out'
        },
        vAxis: {
            logScale: true,
            scaleType: "mirrorLog",
            title: 'Hours'
        }
    };
    var view = new google.visualization.DataView(data);

    view.setColumns([0]);

    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div80'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
        dateAfterClick = data.getValue(chart.getSelection()[0].row, 0);
        if (window.location.pathname !== "/") {
            typeAfterClick = "issue";
            window.location.replace("../info?date=" + dateAfterClick + "&id=" + typeAfterClick);
        }
        else {
            typeAfterClick = "pr";
            window.location.replace("/info?date=" + dateAfterClick + "&id=" + typeAfterClick);
        }
    }
}
