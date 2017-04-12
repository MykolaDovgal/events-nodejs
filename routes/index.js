var express = require('express');
var router = express.Router();
var passport = require('passport');

var loginRoute = require('./login');
var middleware = require('../middlewares');

router.all('*', middleware.all);
//router.all('*', middleware.auth);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home page'});
});

// login
router.get('/login', function (req, res, next) {
    res.render('pages/login', {title: 'Login page'});
});

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login'
        }
    ),
    function (req, res) {
        res.redirect('/');
    });


module.exports = router;
