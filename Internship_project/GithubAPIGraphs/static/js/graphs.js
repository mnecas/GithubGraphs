/**
 * Created by mnecas on 08/07/17.
 */


//Graphs
var dateAfterClick;
var typeAfterClick;
var weekAfterClick;
var time_of_anination = 1000;
var width_ofBar = "90%";
var colors = ["#009f00", "#00bf00", "#94cb2e", "#e4d500", "#ff9933", "#ff6600", "#ff3e00", "#f00000"]

function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'ID');
    data.addColumn('date', 'MERGED_AT');
    data.addColumn('number', 'TIME TO MERGE');
    data.addColumn('string', 'TITLE');
    data.addRows(get_all_info_about_usersIn_month(data_fromDatabase, date));

    var cssClassNames = {
        'headerRow': 'headerChar'
    };
    var options = {
        
        allowHtml: true,
        alternatingRowStyle: false,
        width: "80%",
        'cssClassNames': cssClassNames
    };
    var formatter = new google.visualization.ColorFormat();

    formatter.addRange(0, 3, 'black', '#009f00');
    formatter.addRange(3, 12, 'black', '#00bf00');
    formatter.addRange(12, 24, 'black', '#94cb2e');
    formatter.addRange(24, 48, 'black', '#e4d500');
    formatter.addRange(48, 168, 'black', '#ff9933');
    formatter.addRange(168, 336, 'black', '#ff6600');
    formatter.addRange(336, 720, 'black', '#ff3e00');
    formatter.addRange(720, null, 'black', '#f00000');
    formatter.format(data, 2);

    var table = new google.visualization.Table(document.getElementById('information'));

    data.sort({
        column: 2,
        desc: true
    });

    table.draw(data, options);


    google.visualization.events.addListener(table, 'select',
        function (e) {
            click = data.getValue(table.getSelection()[0].row, 0) + "";
            window.open("//www.github.com/" + githubUser + "/" + githubRepo + "/pull/" + click.replace("#", ""), '_blank');
            table.setSelection();
        });

}

function bySpeed_v2() {
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
    data.addRows(get_data_by_speed_to_graph_v2(data_fromDatabase));
    var cssClassNames = {
        'headerRow': 'headerChar'
    };
    var options = {

        allowHtml: true,
        alternatingRowStyle: false,
        'cssClassNames': cssClassNames
    };

    var table = new google.visualization.Table(document.getElementById('chart_div'));
    for (var i = 0; i < colors.length; i++) {
        var formatter = new google.visualization.ColorFormat();
        formatter.addRange(1, null, 'black', colors[i]);
        formatter.format(data, i + 1);
    }


    table.draw(data, options);


    $("#charts").append('<div id="information" style="margin-left: 200px"></div>');
    google.visualization.events.addListener(table, 'select',
        function (e) {
            if (table.getSelection().length > 0) {
                if (typeof table.getSelection()[0].row === 'object') {
                    table.setSelection();
                    return;
                }
            }
            date = data.getValue(table.getSelection()[0].row, 0);
            _column = 20
            typeAfterClick = "pr";
            google.charts.load('current', {
                'packages': ['table']
            });
            google.charts.setOnLoadCallback(drawTable);

            table.setSelection();
        });

}

function bySpeed() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Closed at');
    data.addColumn('number', '0-3h');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '3-12h');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '12-24h');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '1-2d');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '2-7d');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '7-14d');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '14-30d');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addColumn('number', '30+d');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        'p': {
            'html': true
        }
    });
    data.addRows(get_data_by_speed_to_graph(data_fromDatabase));

    var options = {
        legend: "top",
        height: 400,
        tooltip: {
            isHtml: true
        },
        title: "Per one month",
        bar: {
            groupWidth: width_ofBar
        },
        colors: colors,
        seriesType: 'bars',
        series: {
            8: {
                type: 'line'
            }
        },
        hAxis: {
            format: 'M/yyyy'
        },
        animation: {
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

    var chart = new google.visualization.ComboChart(
        document.getElementById('chart_div'));
    //var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    var changes = true;
    var changeScale = document.getElementById('changeScale');
    changeScale.onclick = function () {
        if (changes) {
            options.vAxis.logScale = true;
            options.vAxis.scaleType = "mirrorLog";
            changes = false;
            changeScale.innerHTML = "LOG scale"

        } else {
            options.vAxis.logScale = false;
            options.vAxis.scaleType = "";
            changes = true;
            changeScale.innerHTML = "LIN scale"

        }
        chart.draw(data, options);

    };

    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);
    $("#charts").append('<div id="information" style="margin-left: 200px"></div>');

    function selectHandler(e) {
        if (chart.getSelection().length > 0) {
            if (typeof chart.getSelection()[0].row === 'object') {
                chart.setSelection();
                return;
            }
        }
        date = data.getValue(chart.getSelection()[0].row, 0);

        typeAfterClick = "pr";
        _column = chart.getSelection()[0].column;
        if (_column < 18) {
            google.charts.load('current', {
                'packages': ['table']
            });
            google.charts.setOnLoadCallback(drawTable);
        }
        chart.setSelection();
    }

}

//Data
var CREATED_AT = 0;
var MERGED_AT = 1;
var NUMBER = 2;
var DIFFERENCE = 3;
var TITLE = 4;

function get_nuberOfColumn(closed_after) {

    if (closed_after < 3) {
        return 1;
    } else if (closed_after < 12) {
        return 3;
    } else if (closed_after < 24) {
        return 5;
    } else if (closed_after < 48) {
        return 7;
    } else if (closed_after < 168) {
        return 9;
    } else if (closed_after < 336) {
        return 11;
    } else if (closed_after < 720) {
        return 13;
    } else {
        return 15;
    }
}

function get_all_info_about_usersIn_month(data, date) {
    var _all_users = [];
    for (var i = 0; i < data.length; i++) {
        if ((data[i][MERGED_AT].getMonth() === date.getMonth()) && (data[i][MERGED_AT].getYear() === date.getYear()) && ((get_nuberOfColumn(data[i][DIFFERENCE]) === _column) || (_column === 20))) {
            hours = " hours "
            months = " months "
            days = " days "
            if (Math.floor((data[i][DIFFERENCE] % 24)) === 1) {
                hours = " hour "
            }
            if (Math.floor((data[i][DIFFERENCE] / 24)) === 1) {
                days = " day "
            }

            if (Math.floor((data[i][DIFFERENCE] / (24 * 30))) === 1) {
                months = " month "
            }
            if ((_column === 1) || (_column === 3) || (_column === 5)) {
                _all_users.push([{
                        v: parseInt(data[i][NUMBER]),
                        f: "#" + data[i][NUMBER]
                    }, data[i][MERGED_AT], {
                        v: Math.floor(data[i][DIFFERENCE] * 100) / 100,
                        f: Math.floor(data[i][DIFFERENCE]) + hours + Math.floor((data[i][DIFFERENCE] % 1) * 60) + " min"
                    }, data[i][TITLE]]

                );
            } else {
                if (Math.floor(data[i][DIFFERENCE]) < 24) {
                    _all_users.push([{
                            v: parseInt(data[i][NUMBER]),
                            f: "#" + data[i][NUMBER]
                        }, data[i][MERGED_AT], {
                            v: Math.floor(data[i][DIFFERENCE] * 100) / 100,
                            f: Math.floor(data[i][DIFFERENCE]) + hours + Math.floor((data[i][DIFFERENCE] % 1) * 60) + " min"
                        }, data[i][TITLE]]

                    );
                } else {
                    _all_users.push([{
                        v: parseInt(data[i][NUMBER]),
                        f: "#" + data[i][NUMBER]
                    }, data[i][MERGED_AT], {
                        v: Math.floor(data[i][DIFFERENCE] * 100) / 100,
                        f: Math.floor((data[i][DIFFERENCE] / 24)) + days + Math.floor((data[i][DIFFERENCE] % 24)) + hours
                    }, data[i][TITLE]]);
                }
            }
        }
    }
    return _all_users
}

function get_info_about_dataByMonth(data) {
    var _infoData = [];
    var _vedlejsi = [];
    for (var i = 0; i < data.length - 1; i++) {
        if (data[i][MERGED_AT].getMonth() !== data[i + 1][MERGED_AT].getMonth()) {
            _vedlejsi.push(data[i]);
            _infoData.push(_vedlejsi);
            _vedlejsi = [];
        } else {
            _vedlejsi.push(data[i]);
        }
    }
    _vedlejsi.push(data[data.length - 1]);
    _infoData.push(_vedlejsi);
    return _infoData
}

function get_info_by_how_long_before_merged(data) {
    var _speed_1 = [];
    var _speed_2 = [];
    var _speed_3 = [];
    var _speed_4 = [];
    var _speed_5 = [];
    var _speed_6 = [];
    var _speed_7 = [];
    var _speed_8 = [];
    var pole = [];
    var _infoData = get_info_about_dataByMonth(data);
    for (var i = 0; i < _infoData.length; i++) {
        for (var ch = 0; ch < _infoData[i].length; ch++) {
            if (_infoData[i][ch][DIFFERENCE] < 3) {
                _speed_1.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 12) {
                _speed_2.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 24) {
                _speed_3.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 48) {
                _speed_4.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 168) {
                _speed_5.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 336) {
                _speed_6.push(_infoData[i][ch]);
            } else if (_infoData[i][ch][DIFFERENCE] < 720) {
                _speed_7.push(_infoData[i][ch]);
            } else {
                _speed_8.push(_infoData[i][ch]);
            }
        }
        pole.push([_speed_1, _speed_2, _speed_3, _speed_4, _speed_5, _speed_6, _speed_7, _speed_8]);
        _speed_1 = [];
        _speed_2 = [];
        _speed_3 = [];
        _speed_4 = [];
        _speed_5 = [];
        _speed_6 = [];
        _speed_7 = [];
        _speed_8 = [];
    }

    return pole
}

function get_data_by_speed_to_graph(data) {
    var pole = [];
    var date;
    var _speeds = get_info_by_how_long_before_merged(data);

    for (var i = 0; i < _speeds.length; i++) {
        for (var ch = 0; ch < _speeds[i].length; ch++) {
            if (_speeds[i][ch].length !== 0) {
                date = _speeds[i][ch][0][MERGED_AT]
            }
        }
        _date = (new Date(date.getYear() + 1900, date.getMonth()) + "").split(" ")
        count = _speeds[i][0].length + _speeds[i][1].length + _speeds[i][2].length + _speeds[i][3].length + _speeds[i][4].length + _speeds[i][5].length + _speeds[i][6].length + _speeds[i][7].length
        pole.push([
            new Date(date.getYear() + 1900, date.getMonth()),
            _speeds[i][0].length, "<div class='googleTr'><h4>" + _speeds[i][0].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][0].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][1].length, "<div class='googleTr'><h4>" + _speeds[i][1].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][1].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][2].length, "<div class='googleTr'><h4>" + _speeds[i][2].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][2].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][3].length, "<div class='googleTr'><h4>" + _speeds[i][3].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][3].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][4].length, "<div class='googleTr'><h4>" + _speeds[i][4].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][4].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][5].length, "<div class='googleTr'><h4>" + _speeds[i][5].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][5].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][6].length, "<div class='googleTr'><h4>" + _speeds[i][6].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][6].length / count) * 1000) / 10 + "%</small></h4></div>",
            _speeds[i][7].length, "<div class='googleTr'><h4>" + _speeds[i][7].length + "<br><small>" + _date[1] + "," + _date[3] + "<br>" + Math.floor((_speeds[i][7].length / count) * 1000) / 10 + "%</small></h4></div>",
        ])
    }
    if (pole.length === 1) {
        pole.push([new Date(date.getYear() + 1900, date.getMonth() - 1),
            null, null,
            null, null,
            null, null,
            null, null,
            null, null,
            null, null,
            null, null,
            null, null
        ])
    }
    return pole
}

function get_data_by_speed_to_graph_v2(data) {
    var pole = [];
    var date;
    var _speeds = get_info_by_how_long_before_merged(data);

    for (var i = 0; i < _speeds.length; i++) {
        for (var ch = 0; ch < _speeds[i].length; ch++) {
            if (_speeds[i][ch].length !== 0) {
                date = _speeds[i][ch][0][MERGED_AT]
            }
        }
        _date = (new Date(date.getYear() + 1900, date.getMonth()) + "").split(" ")
        count = _speeds[i][0].length + _speeds[i][1].length + _speeds[i][2].length + _speeds[i][3].length + _speeds[i][4].length + _speeds[i][5].length + _speeds[i][6].length + _speeds[i][7].length
        pole.push([{
                v: new Date(date.getYear() + 1900, date.getMonth()),
                f: _date[1] + " " + _date[3]
            },
            _speeds[i][0].length, _speeds[i][1].length, _speeds[i][2].length, _speeds[i][3].length, _speeds[i][4].length, _speeds[i][5].length, _speeds[i][6].length, _speeds[i][7].length
        ])
    }
    if (pole.length === 1) {
        pole.push([new Date(date.getYear() + 1900, date.getMonth() - 1),
            null, null,
            null, null,
            null, null,
            null, null
        ])
    }
    return pole
}