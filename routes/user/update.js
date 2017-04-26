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
    console.log(files);
    console.log(req.body);

    Promise.props({
        user: User.findOne({ id: req.body.userId })
    }).then(function (results) {
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
