/**
 * Created by mnecas on 08/07/17.
 */
var dateAfterClick;
var typeAfterClick;
var weekAfterClick;
var time_of_anination=1000;
var width_ofBar ="90%";
function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'ID');
    data.addColumn('date', 'MERGED_AT');
    data.addColumn('string', 'TIME TO MERGE');
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
        window.open("https://github.com/" + githubUser + "/" + githubRepo + "/pull/" + click.replace("#",""));
    }
}
function bySpeed_per_week() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'week');
    data.addColumn('number', '0-3h');
    data.addColumn('number', '3-12h');
    data.addColumn('number', '12-24h');
    data.addColumn('number', '1-2d');
    data.addColumn('number', '2-7d');
    data.addColumn('number', '7-14d');
    data.addColumn('number', '14-30d');
    data.addColumn('number', '30+d');
    data.addRows(get_data_by_speed_to_graphPERWEEK(data_fromDatabase, date));


    var options = {
        legend: "top",
        height: 400,
        //isStacked: true,f
        title: "Weeks",
        bar: {groupWidth: width_ofBar},
        colors: ['#009f00', '#00bf00', '#94cb2e', '#e4d500', '#ff9933', '#ff6600', '#ff1e00', '#c60000'],
        hAxis: {}, animation: {
            startup: true,
            duration: time_of_anination,
            easing: 'out'
        },
        vAxis: {
            logScale: false,
            scaleType: "",
            title: 'Count of PRs'
        }
    };


    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div80'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    var changes = true;
    var changeScale = document.getElementById('changeScale');
    changeScale.onclick = function () {
        if (changes) {
            options.vAxis.logScale = true;
            options.vAxis.scaleType = "mirrorLog";
            changes = false;
            changeScale.innerHTML ="LOG scale"

        }
        else {
            options.vAxis.logScale = false;
            options.vAxis.scaleType = "";
            changes = true;
            changeScale.innerHTML ="LIN scale"

        }
        chart.draw(data, options);

    };

    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);
     $("body").append('<div id="information" style="margin-left: 200px"></div>');

    function selectHandler(e) {

        week=Math.ceil(parseInt(data.getValue(chart.getSelection()[0].row, 0).split(" ")[1])/7);
        _column =chart.getSelection()[0].column;
        google.charts.setOnLoadCallback(drawTable);
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
        bar: {groupWidth: width_ofBar},
        colors: ['#009f00', '#00bf00', '#94cb2e', '#e4d500', '#ff9933', '#ff6600', '#ff1e00', '#c60000'],
        hAxis: {
            format: 'M/yyyy'
        }, animation: {
            startup: true,
            duration: time_of_anination,
            easing: 'out'
        },
        vAxis: {
            logScale: false,
            scaleType: "",
            title: 'Count of PRs'
        }
    };
    var view = new google.visualization.DataView(data);

    view.setColumns([0]);

    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div80'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    var changes = true;
    var changeScale = document.getElementById('changeScale');
    changeScale.onclick = function () {
        if (changes) {
            options.vAxis.logScale = true;
            options.vAxis.scaleType = "mirrorLog";
            changes = false;
            changeScale.innerHTML ="LOG scale"

        }
        else {
            options.vAxis.logScale = false;
            options.vAxis.scaleType = "";
            changes = true;
            changeScale.innerHTML ="LIN scale"

        }
        chart.draw(data, options);

    };

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
