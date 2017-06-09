/**
 * Created by tegos on 14.04.2017.
 */

let crypto = require('crypto');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let sizeOfImage = require('image-size');

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
	]


};

module.exports = util;