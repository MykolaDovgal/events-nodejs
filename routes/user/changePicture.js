var express = require('express');
var router = express.Router();

var path = require('path');
var crypto = require('crypto');
var multer = require('multer');

var User = require('../../models/user');
var util = require('../../util');

var Promise = require('bluebird');
var moment = require('moment');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/users/')
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

router.post('/user/change-picture', upload.any(), function (req, res, next) {

    var files = req.files;

    console.log(files);

    var body = req.body;

    var form_files = ['profile-image', 'userpic'];
    var imageOriginalProfile = '';
    var imageCircleProfile = '';

    files.forEach(function (file) {
        if (file.fieldname === 'profile-image') {
            imageOriginalProfile = file.path + '';
            imageOriginalProfile = imageOriginalProfile.replace(/\//g, '/');
            imageOriginalProfile = imageOriginalProfile.replace('public', '');
        }
        if (file.fieldname === 'userpic') {
            imageCircleProfile = file.path + '';
            imageCircleProfile = imageCircleProfile.replace(/\//g, '/');
            imageCircleProfile = imageCircleProfile.replace('public', '');
        }
    });

    var userData = {
        profile_picture: imageOriginalProfile,
        profile_picture_circle: imageCircleProfile,
    };
    console.warn(userData);
});

module.exports = router;
