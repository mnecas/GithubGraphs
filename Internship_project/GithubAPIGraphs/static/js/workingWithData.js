var CREATED_AT = 0;
var MERGED_AT = 1;
var NUMBER = 2;
var DIFFERENCE = 3;
var TITLE = 4;

function get_week(date) {
    if (date.getDate() < 7) {
        return 1
    }
    else if (date.getDate() < 14) {
        return 2

    }
    else if (date.getDate() < 21) {
        return 3

    }
    else if (date.getDate() < 28) {
        return 4

    }
    else {
        return 5
    }
}
function parse_time(data) {

    if (data.substr(-8, 1) !== ":") {
        data = [data.slice(0, -5), ":00", data.slice(-5)].join('');
    }
    if (data.includes("p.m.")) {
        return data.replace("p.m.", "PM");
    }
    else {
        return data.replace("a.m.", "AM");
    }
}
function is_in_list(list, user) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === user) {
            return true
        }
    }
    return false
}
function get_count_of_months(data) {
    var counter = 0;
    for (var i = 0; i < data.length - 1; i++) {
        if (data[i][MERGED_AT].getMonth() !== data[i + 1][MERGED_AT].getMonth()) {
            counter += 1;
        }

    }
    return counter;

}
function get_merged_by_user(data) {
    var _list_of_users = [];
    var pomocne_pole = [];
    for (var i = 0; i < data.length - 1; i++) {
        var all_usersInMonth = get_all_users_in_month(data, data[i][MERGED_AT]);
        if ((data[i][MERGED_AT].getMonth() !== data[i + 1][MERGED_AT].getMonth())) {
            var pomocne_pomocne_pole = [];
            pomocne_pomocne_pole.push(data[i][MERGED_AT]);
            for (var x = 0; x < all_usersInMonth.length; x++) {
                pomocne_pole.push(all_usersInMonth[x]);
                pomocne_pole.push(get_count_user_in_month(data, data[i][MERGED_AT], all_usersInMonth[x]));
            }
            pomocne_pomocne_pole.push(pomocne_pole);
            _list_of_users.push(pomocne_pomocne_pole);

        }
        pomocne_pole = [];

    }
    return _list_of_users;
}
function get_count_user_in_month(data, date, user) {
    var counter = 0;
    for (var i = 0; i < data.length; i++) {
        if (((data[i][MERGED_AT].getMonth() === date.getMonth()) && (data[i][MERGED_AT].getYear() === date.getYear())) && (data[i][MERGED_BY] === user)) {
            counter += 1;

        }
    }
    return counter;
}
function get_all_users_in_month(data, date) {
    var all_users = [];
    for (var i = 0; i < data.length; i++) {
        if ((data[i][MERGED_AT].getMonth() === date.getMonth()) && (data[i][MERGED_AT].getYear() === date.getYear())) {
            if (!is_in_list(all_users, data[i][MERGED_BY])) {
                all_users.push(data[i][MERGED_BY]);

            }
        }
    }
    return all_users
}
function get_all_info_about_usersIn_month(data, date) {
    var _all_users = [];
    for (var i = 0; i < data.length; i++) {
        if ((data[i][MERGED_AT].getMonth() === date.getMonth()) && (data[i][MERGED_AT].getYear() === date.getYear()) && (get_week(data[i][MERGED_AT]) === parseInt(week))) {
            _all_users.push([ data[i][MERGED_AT], parseInt(data[i][NUMBER]), data[i][DIFFERENCE], data[i][TITLE]]);
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
    return pole
}
function get_data_by_speed_to_graphWITHDATE(data, date) {
    var pole = [];
    var _speeds = get_info_by_how_long_before_mergedWITHDATE(data, date);
    for (var ch = 0; ch < 5; ch++) {
        pole.push([ch, null, null, null, null, null, null, null, null])
    }
    for (var i = 0; i < _speeds.length; i++) {
        pole[get_week(_speeds[i][0][MERGED_AT]) - 1] = [get_week(_speeds[i][0][MERGED_AT]), _speeds[i][1], _speeds[i][2], _speeds[i][3], _speeds[i][4], _speeds[i][5], _speeds[i][6], _speeds[i][7], _speeds[i][8]]
    }
    return pole

}
function get_info_by_how_long_before_mergedINWEEK(data, date, week) {
    var pole = [];
    var _infoData = get_info_about_dataByMonth(data);

    for (var i = 0; i < _infoData.length; i++) {

        for (var ch = 0; ch < _infoData[i].length - 1; ch++) {

            if ((_infoData[i][ch][MERGED_AT].getMonth() === date.getMonth()) && (_infoData[i][ch][MERGED_AT].getYear() === date.getYear()) && (get_week(_infoData[i][ch][MERGED_AT]) === parseInt(week))) {
                var _date=_infoData[i][ch][MERGED_AT];
                if (_infoData[i][ch][DIFFERENCE] < 3) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#009900']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 12) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#00cc00']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 24) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#99ff33']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 48) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#ffff00']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 168) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#ff9933']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 336) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#ff6600']);
                }
                else if (_infoData[i][ch][DIFFERENCE] < 720) {
                    pole.push([_date, _infoData[i][ch][DIFFERENCE], '#ff5050']);
                }
                else {
                    pole.push([_infoData[i][ch][MERGED_AT], _infoData[i][ch][DIFFERENCE], '#ff0000']);
                }
            }
        }
    }
    return pole
}