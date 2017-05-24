var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var Party = require('models/Party');
var Line = require('models/line');

var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/parties/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) {
				return cb(err);
			}
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});

var upload = multer({storage: storage});


router.post('/party/update/:id', upload.any(), function (request, response, next) {
	let body;


	if (request.files) {
		var file = request.files[0];
		var coverPicture = file.path + '';
		coverPicture = coverPicture.replace(/\//g, '/');
		coverPicture = coverPicture.replace('public', '');
		body = {
			name: 'cover_picture',
			value: coverPicture
		};
	}
	else {
		body = request.body;
	}

	let val;
	if (body['value'])
		val = body['value'];
	else
		val = body['value[]'];

	Promise.props({
		party: Party.update({id: request.params.id}, {[body.name]: val,}).execAsync()
	}).then(function (results) {
		console.log(body.name);
		console.log(body['value']);
		response.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

// save address
router.post('/party/update/address/:id', function (request, response, next) {

	let body = request.body;
	let result = {status: true};

	let location = {
		club_name: '',
		country: body.country,
		city: body.locality,
		address: '',
		longitude: {
			lat: body.lat,
			lng: body.lng
		}
	};

	if (!location.city || !location.country) {
		result.status = false;
		result.msg = 'Please, select correct city or country.';
	}

	if (result.status) {

		Promise.props({
			party: Party.update({id: request.params.id}, {location: location}).execAsync()
		}).then(function () {

			result.status = true;
			result.msg = 'Address saved.';
			response.json(result);
		})
			.catch(function (err) {
				next(err);
			});
	} else {
		response.json(result);
	}
});

// save line id
router.post('/party/update/line/:id', function (request, response, next) {

	let body = request.body;

	console.warn(body);
	let result = {};

	let lineId = body.value || 0;

	if (lineId > 0) {

		console.warn(lineId);

		Promise.props({
			party: Party.update({id: request.params.id}, {lineId: lineId}).execAsync(),
			line: Line.findOne({id: lineId}).execAsync()
		}).then(function (result_p) {

			result.msg = 'Line saved.';
			result.line = result_p.line;

			response.json(result);
		})
			.catch(function (err) {
				next(err);
			});
	} else {
		response.json(result);
	}
});

module.exports = router;