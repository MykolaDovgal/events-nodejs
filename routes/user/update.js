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

router.post('/user/update', upload.any(), function (req, res, next) {
    var files = req.files;

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

    Promise.props({
        user: User.findOne({ id: req.body.userId })
    }).then(function (results) {
        if (userData.profile_picture)
            results.user.profile_picture = userData.profile_picture;
        if (userData.profile_picture_circle)
            results.user.profile_picture_circle = userData.profile_picture_circle;
        results.user.active = req.body.active ? true : false;
        results.user.username = req.body.username;
        results.user.firstname = req.body.firstname;
        results.user.lastname = req.body.lastname;
        results.user.facebook_profile = req.body.facebook;
        results.user.email = req.body.email;
        results.user.date_of_birth = util.stringToDate(req.body.dateofbirth, 'dd.mm.yyyy', '.');
        results.user.about = req.body.about;
        results.user.save();
        res.json(results.user);
    }).catch(function (err) {
        next(err);
    });

});

module.exports = router;
