let express = require('express');
let Promise = require('bluebird');
let path = require('path');
let crypto = require('crypto');
let Line = require('models/Line');
let util = require('../../util/index');
let router = express.Router();
let multer = require('multer');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, util.getAbsolutePath('lines'))
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

let upload = multer({storage: storage});

router.post('/line/update/:id', upload.any(), function (req, res, next) {
	let body = {};
	let files = req.files;


	let picture = {};

	if (files) {
		files.forEach(function (file) {
			if (file.fieldname === 'cover-image') {
				picture.original = util.getRelativePath(file.path);
			}
			if (file.fieldname === 'cover_picture') {
				picture.circle = util.getRelativePath(file.path);
			}
		});
		Promise.props({
			line: Line.findOne({id: req.params.id}).execAsync()
		}).then(function (results) {
			if (picture.original)
				results.line.cover_picture_original = picture.original;
			if (picture.circle)
				results.line.cover_picture = picture.circle;
			results.line.save();
		});
	}
	else {
		body = req.body;
	}

	let val;
	let error_message = 'Problem with update values';
	if (body['value'])
		val = body['value'];
	else
		val = body['value[]'];

	Promise.props({
		line: Line.update({id: req.params.id}, {[body.name]: val}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {

			console.warn(err);
			res.status(500);
			res.send(error_message);
		});
});

// save address
router.post('/line/update/address/:id', function (req, res, next) {

	let body = req.body;
	let result = {status: true};

	let address = {
		city: body.locality,
		country: body.country,
		countryCode: body.country_short,
		latitude: body.lat,
		longitude: body.lng
	};

	if (!address.city || !address.country) {
		result.status = false;
		result.msg = 'Please, select correct city or country.';
	}

	if (result.status) {

		Promise.props({
			line: Line.update({id: req.params.id}, {address: address}).execAsync()
		}).then(function () {

			result.status = true;
			result.msg = 'Address saved.';
			res.json(result);
		})
			.catch(function (err) {
				next(err);
			});
	} else {
		res.json(result);
	}
});

module.exports = router;