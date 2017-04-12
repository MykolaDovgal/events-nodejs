var express = require('express');
var router = express.Router();
var passport = require('passport');

// login page

router.get('/login', function (req, res, next) {
    res.render('index', {title: 'login login'});
});

router.post('/login', function (req, res, next) {
    log.info('someone trying to login');

    passport.authenticate('local', {
        successRedirect: '/private',
        failureRedirect: '/'
    })(req, res, next);

});

module.exports = router;
