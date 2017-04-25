var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('models/user');

router.get('/logout', function (req, res) {
    User.setLogOutTime(req.user.id);
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;
