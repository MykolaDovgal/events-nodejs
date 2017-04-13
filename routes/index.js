var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

var path = require('path')

var crypto = require('crypto');

var multer = require('multer');

var uploadProfileImgs = multer({dest: './public/uploads/'}).single('profile-image');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/users/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});

var upload = multer({storage: storage});

var middleware = require('../middlewares');
var api_router = require('./api');
var home = require('./home');
var users = require('./users');

router.all('*', middleware.all);
router.all('*', middleware.auth);


/* GET home page. */
router.get('/', home);

/* page users . */
router.get('/users', users);

// login
router.get('/login', function (req, res, next) {
    var data = {
        title: 'Login'
    };
    res.render('pages/login', data);
});

router.post('/login', function (req, res, next) {
    console.warn('trying to login');

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);

});

// create user
router.post('/user/add', upload.single('profile-image'), function (req, res, next) {

    var result = {
        message: 'error',
        status: 0
    };
    var array_field = [
        'username',
        'password', 'repeat-password',
        'firstname',
        'lastname', 'email', 'profile-image',
        'dateofbirth'
    ];

    var body = req.body;
    var checker_form = true;

    array_field.forEach(function (field) {
        if (!body[field] || !body[field].trim()) {
            checker_form = false;
        }
    });

    var imageProfile = '';
    if (req.file) {
        imageProfile = req.file.path
    }


    var userData = {
        username: body['username'],
        password: body['password'],
        firstname: body['firstname'],
        lastname: body['lastname'],
        realname: body['firstname'] + ' ' + body['lastname'],
        email: body['email'],
        permission_level: 1,
        profile_picture: imageProfile
    };
    console.log(userData);

    var user = new User(userData);


    if (checker_form) {
        var saved = true;
        //save the user
        user.save(function (err) {
            if (err) {
                console.log(err);
                saved = false;
            } else {
                result = {
                    message: 'Success',
                    status: 1
                };
            }
        });
    }

    console.log(result);


    res.json(result);
});


module.exports = router;
