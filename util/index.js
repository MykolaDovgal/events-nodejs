/**
 * Created by tegos on 14.04.2017.
 */

let crypto = require('crypto');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let sizeOfImage = require('image-size');
let moment = require('moment');

let util;
util = {
	_t: this,
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
		let allowedMimeTypesForImages = this.allowedMimeTypesForImages;

		if (typeof data_field !== 'undefined' && data_field !== null
			&& data_field.indexOf('http://') === -1 && data_field.indexOf('https://') === -1
		) {
			let path = 'public' + data_field;
			if (fs.existsSync(path)) {
				let type = mime.lookup(path);


				if (allowedMimeTypesForImages.includes(type)) {
					try {
						let dimensions = sizeOfImage(path);
						if (dimensions.width && dimensions.height) {
							result = data_field;
						}
					} catch (e) {
						fs.unlink(path, () => {
							console.warn('Image ' + path + ' removed');
						});
						result = default_image;
					}

				} else {
					result = default_image;
				}
			} else {
				result = default_image;
			}
		} else {
			result = data_field;
		}

		if (result === undefined || result.trim().length < 5) {
			result = default_image;
		}

		return result;
	},
	isEmptyValidator: {
		validator: function (v) {
			let result = (v && v.trim() !== '' && v.trim().length > 1);
			console.warn(result);
			return result;
		},
		message: 'Can not be empty.'
	},
	allowedMimeTypesForImages: [
		'image/gif',
		'image/jpeg',
		'image/pjpeg',
		'image/png',
		'image/tiff',
		'image/webp'
	],
	barCounterResult: function (result) {
		let dayArrays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		let date = Date.now();
		let todayDate = new Date(date);

		let counter = {open: 0, close: 0, all: 0,openBarId : [],closeBarId : []};
		try {
			result.forEach((openingTime) => {

				let dayObj = openingTime.opening_times[dayArrays[todayDate.getDay()]];
				if (dayObj['open'] && dayObj['close'] && (dayObj['open'] !== '-' && dayObj['open'] !== 'The last Client') && (dayObj['close'] !== '-' && dayObj['close'] !== 'The last Client')) {
					let separateOpenTimeHour = dayObj['open'].split(':');
					let separateCloseTimeHour = dayObj['close'].split(':');

					let from = new Date(moment(date).format('YYYY-MM-DD'));
					from.setHours(+separateOpenTimeHour[0], +separateOpenTimeHour[1]);
					let to = new Date(moment(date).format('YYYY-MM-DD'));
					to.setHours(+separateCloseTimeHour[0], +separateCloseTimeHour[1]);

					if (todayDate.getTime() > from.getTime() && todayDate.getTime() < to.getTime()) {
						counter['open'] += 1;
						counter['openBarId'].push(openingTime.id);
					} else {
						counter['close'] += 1;
						counter['closeBarId'].push(openingTime.id);
					}
				}

				counter['all'] += 1;
			});
		} catch (e) {
			console.warn(e);
		}

		return counter;
	},
	isImage: function (path) {
		let result = false;
		let allowedMimeTypesForImages = this.allowedMimeTypesForImages;
		if (fs.existsSync(path)) {
			let type = mime.lookup(path);


			if (allowedMimeTypesForImages.includes(type)) {
				try {
					let dimensions = sizeOfImage(path);
					if (dimensions.width && dimensions.height) {
						result = true;
					}
				} catch (e) {
				}

			}
		}
		return result;
	}


};

module.exports = util;