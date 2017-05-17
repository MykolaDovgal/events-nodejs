var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var Party = require('models/Party');

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
        console.log(body);
        console.log(body.name);
        console.log(body['value']);
        response.status(200).send(body['value']);
    })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;