'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore');
var express = require('express');
var User = require('../../models/user');

module.exports = function (req, res, next) {
    User.findOne({ id: req.params.id })
        .exec(function (err, result) {
            console.log(result);
            next(err);
        });

    //View should be rendered here
};