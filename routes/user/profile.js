'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore');
var express = require('express');
var User = require('../../models/user');

module.exports = function (req, res, next) {

    var data = {};

    User.findOne({ id: req.params.id })
        .exec(function (err, result) {
            console.log(result);
            data.user = result;
            data.title = data.user.firstname + '\'s Profile';
            data.showMenu = true;
            res.render('pages/profile', data);
        });
};