var express = require('express');
var router = express.Router();
var passport = require('passport');

require('rootpath')();

var User = require('models/user');
var Line = require('models/line');
let config = require('config');

var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);


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

router.post('/lines/:page?', function (req, res, next) {
    let limit = config.get('project:lines:limit_on_page') || 9;
    let search = req.query.search;
    let page = req.params.page || 1;
    if (page < 1) {
        page = 1;
    }

    console.log(search);
    console.log(page);

    Promise.props({
        lines: Line.paginate({}, {page: page, limit: limit})
    }).then(function (results) {
        let data = {
            data: results.lines.docs
        };

        res.json(data);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
