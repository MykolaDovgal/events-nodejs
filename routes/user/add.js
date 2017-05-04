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

router.post('/user/add', upload.any(), function (req, res, next) {

    var files = req.files;

    console.log(files);

    var result = {
        message: 'User added',
        status: 1
    };
    var array_field = [
        'username',
        'password', 'repeat-password',
        'firstname',
        'lastname', 'email',
        'dateofbirth'
    ];

    var body = req.body;
    var checker_form = true;

    array_field.forEach(function (field) {
        if (!body[field] || !body[field].trim()) {
            checker_form = false;
        }
    });

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

    var dateofbirthObject = util.stringToDate(body['dateofbirth'], 'dd.mm.yyyy', '.');


    var userData = {
        username: body['username'],
        password: body['password'],
        'repeat-password': body['repeat-password'],
        firstname: body['firstname'],
        lastname: body['lastname'],
        realname: body['firstname'] + ' ' + body['lastname'],
        email: body['email'],
        permission_level: 1,
        profile_picture: imageOriginalProfile,
        profile_picture_circle: imageCircleProfile,
        date_of_birth: dateofbirthObject
    };
    console.warn(userData);


    Promise.props({
        isEmail: User.count({email: userData.email}).execAsync(),
        isLogin: User.count({username: userData.username}).execAsync()
    })
        .then(function (results) {

            //console.warn(results);

            if (results.isEmail) {
                result = {
                    message: 'This email already exists',
                    status: 0
                };
            }

            if (results.isLogin) {
                result = {
                    message: 'This username already exists',
                    status: 0
                };
            }

            if (userData.password !== userData['repeat-password']) {
                result = {
                    message: 'Passwords are mismatch',
                    status: 0
                };
            }

            if (result.status) {
                //save the user
                var user = new User(userData);
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        result = {
                            message: 'Error',
                            status: 0
                        };
                    }

                    res.json(result);
                });
            } else {
                res.json(result);
            }
        })
        .catch(function (err) {
            console.error(err);
            res.send(err);
        });


});

module.exports = router;
