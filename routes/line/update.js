var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var Line = require('models/line');

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


router.post('/line/update/:id', upload.any(), function (request, response, next) {
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
        line: Line.update({id: request.params.id}, {[body.name]: val,}).execAsync()
    }).then(function (results) {
        console.log(body);
        console.log(body.name);
        console.log(body['value']);
        response.status(200).send(body['value']);
    })
        .catch(function (err) {
            next(err);
        });
});

// save address
router.post('/line/update/address/:id', function (request, response, next) {

    let body = request.body;
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
            line: Line.update({id: request.params.id}, {address: address}).execAsync()
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

module.exports = router;