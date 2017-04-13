var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);

var middleware = require('../middlewares');


/* json users . */
router.get('/', function (req, res, next) {
    res.json({'test': true});
});

router.get('/users', function (req, res) {


    Promise.props({
        users: User.find({}, function (err, users) {
            var userMap = {};

            users.forEach(function (user) {
                userMap[user._id] = user;
            });

        }).execAsync()
    })
        .then(function (results) {
            //console.warn(results);
            var data = {
                data: results.users
            };

            res.json(data);
        })
        .catch(function (err) {
            res.send(500);
        });


});


module.exports = router;
