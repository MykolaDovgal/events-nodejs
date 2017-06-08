let express = require('express');
let Promise = require('bluebird');
let path = require('path');
let crypto = require('crypto');
let config = require('config');
let multer = require('multer');

let Bar = require('models/Bar');

let router = express.Router();


let text = {
	'empty': config.get('text:empty'),
	'not_selected': config.get('text:not_selected'),
};

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/bars/')
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


router.post('/bar/update/:id', upload.any(), function (req, res, next) {

	console.warn(req.body);

	let body = {};
	let files = req.files;

	let imageOriginal = '';
	let image = '';

	let picture = {};

	if (files) {
		files.forEach(function (file) {
			if (file.fieldname === 'cover-image') {
				imageOriginal = file.path + '';
				imageOriginal = imageOriginal.replace(/\//g, '/');
				imageOriginal = imageOriginal.replace('public', '');
				picture.original = imageOriginal;
			}
			if (file.fieldname === 'cover_picture') {
				image = file.path + '';
				image = image.replace(/\//g, '/');
				image = image.replace('public', '');
				picture.circle = image;
			}
		});
		Promise.props({
			bar: Bar.findOne({id: req.params.id}).execAsync()
		}).then(function (results) {
			if (picture.original)
				results.bar.cover_picture_original = picture.original;
			if (picture.circle)
				results.bar.cover_picture = picture.circle;

			results.bar.save();
		});
	}
	else {
		body = req.body;
	}


	let val;
	if (body['value'])
		val = body['value'];
	else
		val = body['value[]'];

	Promise.props({
		bar: Bar.update({id: req.params.id}, {[body.name]: val,}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			console.warn(err);
			res.status(500);
			res.send(err.message);
		});
});

// save address
router.post('/bar/update/address/:id', function (req, res, next) {

	let body = req.body;
	let result = {status: true};

	let location = {
		country: body.country,
		city: body.locality,
		address: '',
		longitude: {
			lat: body.lat,
			lng: body.lng
		}
	};

	console.warn('location', location);

	if (!location.city || !location.country) {
		result.status = false;
		result.msg = 'Please, select correct city or country.';
	}

	if (result.status) {

		Promise.props({
			bar: Bar.update({id: req.params.id}, {location: location}).execAsync()
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