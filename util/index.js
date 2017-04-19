/**
 * Created by tegos on 14.04.2017.
 */

var crypto = require('crypto');
var path = require('path');

var util = {
    isset: function (data) {
        return typeof data !== 'undefined' && data !== null;
    },
    getImageRandomName: function (name) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            return raw.toString('hex') + path.extname(name);
        });
    },
    stringToDate: function (_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    }
};

module.exports = util;