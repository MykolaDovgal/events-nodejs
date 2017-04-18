var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var util = require('../util');

var Promise = require('bluebird');

var path = require('path');
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
var logout = require('./logout');

router.use(logout);


router.all('*', middleware.all);
router.all('*', middleware.auth);


/* GET home page. */
router.get('/', home);

/* page users . */
router.get('/users', users);

// login
router.get('/login', function (req, res, next) {
    var data = {
        title: 'Login',
        showMenu: false
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

    var imageProfile = '';
    if (req.file) {
        imageProfile = req.file.path + '';
        imageProfile = imageProfile.replace(/\//g, '/');
        imageProfile = imageProfile.replace('public', '');
    }

    var user_active = 0;
    if (util.isset(body['active'])) {
        if (body['active'].trim() !== '0') {
            user_active = 1;
        }
    }


    var userData = {
        username: body['username'],
        password: body['password'],
        'repeat-password': body['repeat-password'],
        firstname: body['firstname'],
        lastname: body['lastname'],
        realname: body['firstname'] + ' ' + body['lastname'],
        email: body['email'],
        permission_level: 1,
        active: user_active,
        profile_picture: imageProfile
    };
    //console.log(userData);


    Promise.props({
        isEmail: User.count({email: userData.email}).execAsync(),
        isLogin: User.count({username: userData.username}).execAsync()
    })
        .then(function (results) {

            console.warn(results);
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
                    console.log(result);
                    res.json(result);
                });
            } else {
                res.json(result);
            }
        })
        .catch(function (err) {
            res.send(500);
        });


});


module.exports = router;
