var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;
