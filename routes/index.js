var express = require('express');
var router = express.Router();
var passport = require('passport');

var middleware = require('../middlewares');

router.all('*', middleware.all);
router.all('*', middleware.auth);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home page'});
});

// login
router.get('/login', function (req, res, next) {
    res.render('pages/login', {title: 'Login page'});
});

router.post('/login', function (req, res, next) {
    console.warn('someone trying to login');

    passport.authenticate('local', {
        successRedirect: '/private',
        failureRedirect: '/login'
    })(req, res, next);

});

router.get('/private',
    function (req, res) {
        res.render('index', {title: req.user.name});
    });


module.exports = router;
