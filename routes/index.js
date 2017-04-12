var express = require('express');
var router = express.Router();
var passport = require('passport');

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

router.get('/private',
    function (req, res) {
        res.render('index', {title: req.user.name});
    });


module.exports = router;
