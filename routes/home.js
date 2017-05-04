'use strict';
/**
 * Module dependencies.
 */
var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');

require('rootpath')();

var User = require('models/user');
var Line = require('models/line');


Promise.promisifyAll(mongoose);

module.exports = function (req, res, next) {

    Promise.props({
        userAllCount: User.count().execAsync(),
        userAllActiveCount: User.count({active: true}).execAsync(),
        lineActiveCount: Line.count({active: true}).execAsync(),
        lineUnActiveCount: Line.count({active: false}).execAsync()
    })
        .then(function (results) {
            console.warn(results);
            var data = {
                title: 'Home',
                showMenu: true,
                userAllCount: results.userAllCount,
                userAllActiveCount: results.userAllActiveCount,
                lineActiveCount: results.lineActiveCount,
                lineUnActiveCount: results.lineUnActiveCount,
            };
            res.render('pages/home', data);
        })
        .catch(function (err) {
            res.send(err);
        });
};
