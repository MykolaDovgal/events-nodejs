/**
 * Created by tegos on 14.04.2017.
 */

let crypto = require('crypto');
let path = require('path');
let fs = require('fs');

let util = {
	isset: function (data) {
		return typeof data !== 'undefined' && data !== null;
	},
	getImageRandomName: function (name) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			return raw.toString('hex') + path.extname(name);
		});
	},
	stringToDate: function (_date, _format, _delimiter) {
		let formatLowerCase = _format.toLowerCase();
		let formatItems = formatLowerCase.split(_delimiter);
		let dateItems = _date.split(_delimiter);
		let monthIndex = formatItems.indexOf("mm");
		let dayIndex = formatItems.indexOf("dd");
		let yearIndex = formatItems.indexOf("yyyy");
		let month = parseInt(dateItems[monthIndex]);
		month -= 1;
		return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
	},
	getImage: function (object_data, field, default_image) {
		let result = default_image;
		let data_field = object_data[field];

		if (typeof data_field !== 'undefined'
			&& data_field.indexOf('http://') === -1 && data_field.indexOf('https://') === -1
		) {
			let path = 'public' + data_field;
			if (fs.existsSync(path)) {
				result = data_field;
			} else {
				result = default_image;
			}
		} else {
			result = data_field;
		}
		return result;
	}
};

module.exports = util;