'use strict';
var fs = require('fs');
var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var config = require('config');
var default_image_user = config.get('images:default_image_user');

Promise.promisifyAll(mongoose);

var User = require('models/user');

module.exports = function (req, res, next) {

    Promise.props({
        user: User.findOne({id: req.params.id}).execAsync()
    })
        .then(function (results) {
            var user = results.user;
            var title_page = user.username + "'s Profile";

            if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
                user.profile_picture_circle = default_image_user;

            var data = {
                title: title_page,
                showMenu: true,
                user: user,
                dateOfBirth: moment(user.date_of_birth).format('DD.MM.YYYY')
            };

            res.render('pages/profile', data);
        })
        .catch(function (err) {
            next(err);
        });
};