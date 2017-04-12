/**
 * Created by tegos on 11.04.2017.
 */

var express = require('express');
var router = express.Router();

var authenticated = require('./authenticated');


var middlewares = {
    'auth': authenticated,
    'all': function (req, res, next) {
        //console.warn('user ', req.user);
        console.log('all Time:', Date.now());
        next();
    }
};

module.exports = middlewares;
