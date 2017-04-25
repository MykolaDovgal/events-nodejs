var express = require('express');
var router = express.Router();
var passport = require('passport');

// Todo: write method for saving logout time

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;
