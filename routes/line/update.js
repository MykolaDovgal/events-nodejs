var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var Line = require('models/Line');

var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/lines/')
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

router.post('/line/update/:id', upload.any(), function (req, res, next) {
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
            line: Line.findOne({ id: req.params.id }).execAsync()
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
    if (body['value'])
        val = body['value'];
    else
        val = body['value[]'];

    Promise.props({
        line: Line.update({id: req.params.id}, {[body.name]: val,}).execAsync()
    }).then(function (results) {
        res.status(200).send(body['value']);
    })
        .catch(function (err) {
            next(err);
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