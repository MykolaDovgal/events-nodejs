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


router.post('/party/update/:id', upload.any(), function (req, res, next) {
	let body = {};
    let files = req.files;

    console.log(files);

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
            party: Party.findOne({ id: req.params.id }).execAsync()
        }).then(function (results) {
            if (picture.original)
                results.party.cover_picture_original = picture.original;
            if (picture.circle)
                results.party.cover_picture = picture.circle;
            results.party.save();
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
		party: Party.update({id: req.params.id}, {[body.name]: val,}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

// save address
router.post('/party/update/address/:id', function (req, res, next) {

	let body = req.body;
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
			party: Party.update({id: req.params.id}, {location: location}).execAsync()
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

// save line id
router.post('/party/update/line/:id', function (req, res, next) {

	let body = req.body;

	console.warn(body);
	let result = {};

	let lineId = body.value || 0;

	if (lineId > 0) {

		console.warn(lineId);

		Promise.props({
			party: Party.update({id: req.params.id}, {lineId: lineId}).execAsync(),
			line: Line.findOne({id: lineId}).execAsync()
		}).then(function (result_p) {

			result.msg = 'Line saved.';
			result.line = result_p.line;

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