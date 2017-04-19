(function () {
    'use strict';

    /**
     * Module dependencies.
     */
    var _ = require('underscore');
    var express = require('express');
    var User = require('../models/user');
    var Promise = require('bluebird');


    module.exports = function (req, res, next) {

        Promise.props({
            userAllCount: User.count().execAsync(),
            userAllActiveCount: User.count({active: true}).execAsync()
        })
            .then(function (results) {
                console.warn(results);
                var data = {
                    title: 'Users',
                    showMenu: true,
                    userAllCount: results.userAllCount,
                    userAllActiveCount: results.userAllActiveCount
                };
                res.render('pages/users', data);
            })
            .catch(function (err) {
                res.send(500);
            });
    };

})();


