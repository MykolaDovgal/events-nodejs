var express = require('express');
var router = express.Router();
var passport = require('passport');

require('rootpath')();

var util = require('util');
var Promise = require('bluebird');

var User = require('models/user');


var middleware = require('middlewares');


var home = require('./home');
var users = require('./users');

var profile = require('./user/profile');
var logout = require('./logout');

var lines = require('./line/lines');
var line = require('./line/line');
var line_add = require('./line/add');

var user_add = require('./user/add');
var user_update = require('./user/update');
var user_delete = require('./user/delete');
var user_changePicture = require('./user/changePicture');


router.all('*', middleware.all);
router.all('*', middleware.auth);

router.use(logout);
router.use(user_add);
router.use(user_update);
router.use(user_delete);
router.use(user_changePicture);

router.use(lines);
router.use(line);
router.use(line_add);


/* GET home page. */
router.get('/', home);

/* page users . */
router.get('/users', users);
router.all('/users/:id?', profile);


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

    // passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // })(req, res, next);

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log(info);
            return res.redirect('/login')
        }
        // user ok
        req.logIn(user, function (err) {
            console.log(info);
            console.error(user);
            // save login time
            User.setLogInTime(user.id);
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);


});


module.exports = router;
