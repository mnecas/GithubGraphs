var CREATED_AT = 0;
var MERGED_AT = 1;
var NUMBER = 2;
var DIFFERENCE = 3;
var TITLE = 4;

function get_week(date) {
    if (date.getDate() <= 7) {
        return 1
    }
    else if (date.getDate() <= 14) {
        return 2

    }
    else if (date.getDate() <= 21) {
        return 3

    }
    else if (date.getDate() <= 28) {
        return 4

    }
    else {
        return 5
    }
}

function get_nuberOfColumn(closed_after) {

    if (closed_after < 3) {
        return 1;
    }
    else if (closed_after < 12) {
        return 2;
    }
    else if (closed_after < 24) {
        return 3;
    }
    else if (closed_after < 48) {
        return 4;
    }
    else if (closed_after < 168) {
        return 5;
    }
    else if (closed_after < 336) {
        return 6;
    }
    else if (closed_after < 720) {
        return 7;
    }
    else {
        return 8;
    }
}

function get_all_info_about_usersIn_month(data, date) {
    var _all_users = [];
    for (var i = 0; i < data.length; i++) {
        if ((data[i][MERGED_AT].getMonth() === date.getMonth()) && (data[i][MERGED_AT].getYear() === date.getYear()) && (get_week(data[i][MERGED_AT]) === parseInt(week)) && (get_nuberOfColumn(data[i][DIFFERENCE]) === _column)) {
            if ((_column === 1) || (_column === 2) || (_column === 3)) {
                _all_users.push(["#" + data[i][NUMBER], data[i][MERGED_AT], Math.round(data[i][DIFFERENCE] * 10) / 10 + " h", data[i][TITLE]]);
            }
            else {
                _all_users.push(["#" + data[i][NUMBER], data[i][MERGED_AT], Math.round((data[i][DIFFERENCE] / 24) * 10) / 10 + " d", data[i][TITLE]]);
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
            }
            else if (_infoData[i][ch][DIFFERENCE] < 12) {
                _speed_2.push(_infoData[i][ch]);
            }
            else if (_infoData[i][ch][DIFFERENCE] < 24) {
                _speed_3.push(_infoData[i][ch]);
            }
            else if (_infoData[i][ch][DIFFERENCE] < 48) {
                _speed_4.push(_infoData[i][ch]);
            }
            else if (_infoData[i][ch][DIFFERENCE] < 168) {
                _speed_5.push(_infoData[i][ch]);
            }
            else if (_infoData[i][ch][DIFFERENCE] < 336) {
                _speed_6.push(_infoData[i][ch]);
            }
            else if (_infoData[i][ch][DIFFERENCE] < 720) {
                _speed_7.push(_infoData[i][ch]);
            }
            else {
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

function get_info_by_how_long_before_mergedWITHDATE(data, date) {
    var _counter_1 = 0;
    var _counter_2 = 0;
    var _counter_3 = 0;
    var _counter_4 = 0;
    var _counter_5 = 0;
    var _counter_6 = 0;
    var _counter_7 = 0;
    var _counter_8 = 0;
    var pole = [];


    var _infoData = get_info_about_dataByMonth(data);

    if (_infoData.length === 1) {
        if (_infoData[0][0][DIFFERENCE] < 3) {
            _counter_1 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 12) {
            _counter_2 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 24) {
            _counter_3 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 48) {
            _counter_4 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 168) {
            _counter_5 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 336) {
            _counter_6 += 1
        }
        else if (_infoData[0][0][DIFFERENCE] < 720) {
            _counter_7 += 1
        }
        else {
            _counter_8 += 1
        }
    }
    for (var i = 0; i < _infoData.length; i++) {

        for (var ch = 0; ch < _infoData[i].length - 1; ch++) {

            if ((_infoData[i][ch][MERGED_AT].getMonth() === date.getMonth()) && (_infoData[i][ch][MERGED_AT].getYear() === date.getYear())) {

                if (_infoData[i][ch][DIFFERENCE] < 3) {
                    _counter_1 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 12) {
                    _counter_2 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 24) {
                    _counter_3 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 48) {
                    _counter_4 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 168) {
                    _counter_5 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 336) {
                    _counter_6 += 1
                }
                else if (_infoData[i][ch][DIFFERENCE] < 720) {
                    _counter_7 += 1
                }
                else {
                    _counter_8 += 1
                }
                if (get_week(_infoData[i][ch + 1][MERGED_AT]) !== get_week(_infoData[i][ch][MERGED_AT])) {

                    pole.push([_infoData[i][ch], _counter_1, _counter_2, _counter_3, _counter_4, _counter_5, _counter_6, _counter_7, _counter_8]);
                    _counter_1 = 0;
                    _counter_2 = 0;
                    _counter_3 = 0;
                    _counter_4 = 0;
                    _counter_5 = 0;
                    _counter_6 = 0;
                    _counter_7 = 0;
                    _counter_8 = 0;
                }
                if (_infoData[i].length - 2 === ch) {
                    if (_infoData[i][ch + 1][DIFFERENCE] < 3) {
                        _counter_1 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 12) {
                        _counter_2 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 24) {
                        _counter_3 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 48) {
                        _counter_4 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 168) {
                        _counter_5 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 336) {
                        _counter_6 += 1
                    }
                    else if (_infoData[i][ch + 1][DIFFERENCE] < 720) {
                        _counter_7 += 1
                    }
                    else {
                        _counter_8 += 1
                    }
                    pole.push([_infoData[i][ch], _counter_1, _counter_2, _counter_3, _counter_4, _counter_5, _counter_6, _counter_7, _counter_8]);
                    _counter_1 = 0;
                    _counter_2 = 0;
                    _counter_3 = 0;
                    _counter_4 = 0;
                    _counter_5 = 0;
                    _counter_6 = 0;
                    _counter_7 = 0;
                    _counter_8 = 0;
                }
            }
        }
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
        pole.push([new Date(date.getYear() + 1900, date.getMonth()), _speeds[i][0].length, _speeds[i][1].length, _speeds[i][2].length, _speeds[i][3].length, _speeds[i][4].length, _speeds[i][5].length, _speeds[i][6].length, _speeds[i][7].length])
    }
    if (pole.length === 1) {
        pole.push([new Date(date.getYear() + 1900, date.getMonth() - 1), null, null, null, null, null, null, null, null])
    }
    return pole
}

function get_data_by_speed_to_graphPERWEEK(data, date) {
    var pole = [];
    var _speeds = get_info_by_how_long_before_mergedWITHDATE(data, date);
    for (var ch = 0; ch < _speeds.length; ch++) {
        pom = ("" + new Date(_speeds[ch][0][MERGED_AT].getYear() + 1900, _speeds[ch][0][MERGED_AT].getMonth(), get_week(_speeds[ch][0][MERGED_AT]) * 7)).split(" ");
        pole.push([str_date = pom[1] + " " + pom[2] + " " + pom[3], null, null, null, null, null, null, null, null])
    }
    for (var i = 0; i < _speeds.length; i++) {
        if (get_week(_speeds[i][0][MERGED_AT]) === 5) {
            pom = (new Date(_speeds[i][0][MERGED_AT].getYear() + 1900, _speeds[i][0][MERGED_AT].getMonth() + 1, 0) + "").split(" ");
            str_date = pom[1] + " " + 29 + " " + pom[3] + "---" + pom[1] + " " + parseInt(pom[2]) + " " + pom[3];
        } else {
            pom = (new Date(_speeds[i][0][MERGED_AT].getYear() + 1900, _speeds[i][0][MERGED_AT].getMonth(), get_week(_speeds[i][0][MERGED_AT]) * 7) + "").split(" ");
            str_date = pom[1] + " " + (parseInt(pom[2]) - 6) + " " + pom[3] + "---" + pom[1] + " " + parseInt(pom[2]) + " " + pom[3];
        }
        pole[get_week(_speeds[i][0][MERGED_AT]) - 1] = [str_date, _speeds[i][1], _speeds[i][2], _speeds[i][3], _speeds[i][4], _speeds[i][5], _speeds[i][6], _speeds[i][7], _speeds[i][8]]
    }
    return pole

}