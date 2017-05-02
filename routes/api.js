var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var _ = require('underscore');

require('rootpath')();

var User = require('models/user');
var Line = require('models/line');
let config = require('config');

var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);


router.get('/users', function (req, res, next) {
    Promise.props({
        users: User.find({}).execAsync()
    })
        .then(function (results) {
            results.users.map(function(user) {
                if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture.includes('http'))
                    user.profile_picture_circle = 'images/icons/no-pic.png';
                return user;
            });

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
