var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);

var middleware = require('../middlewares');

router.get('/users', function (req, res, next) {
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
            next(err)
        });
});

router.get('/activity/:id?', function (req, res, next) {
    Promise.props({
        user: User.findOne({id: req.params.id})
    }).then(function (results) {
        var data = {
            data: results.user.getActivity()
        };

        res.json(data);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
