var express = require('express');
var router = express.Router();
var passport = require('passport');

var util = require('../util');
var Promise = require('bluebird');


var middleware = require('../middlewares');
var api_router = require('./api');
var home = require('./home');
var users = require('./users');
var profile = require('./user/profile');
var logout = require('./logout');
var lines = require('./line/lines');

var user_add = require('./user/add');


router.use(logout);
router.use(user_add);
router.use(lines);


router.all('*', middleware.all);
router.all('*', middleware.auth);


/* GET home page. */
router.get('/', home);

/* page users . */
router.get('/users', users);
router.all('/users/:id?', profile);

// GET Lines pages
//router.use('/lines',lines);

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


module.exports = router;
