(function () {
    'use strict';

    /**
     * Module dependencies.
     */
    var _ = require('underscore');
    var express = require('express');
    var User = require('../models/user');

    var mongoose = require('mongoose');
    var Promise = require('bluebird');

    Promise.promisifyAll(mongoose);

    module.exports = function (req, res, next) {

        Promise.props({
            userCount: User.count().execAsync()
        })
            .then(function (results) {
                console.warn(results);
                var data = {
                    title: 'Home',
                    userCount: results.userCount
                };
                res.render('pages/home', data);
            })
            .catch(function (err) {
                res.send(500);
            });
    };

})();


