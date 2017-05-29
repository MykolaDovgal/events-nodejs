'use strict';

/**
 * Module dependencies.
 */
let _ = require('underscore');
let express = require('express');
let User = require('../models/user');
let Promise = require('bluebird');

module.exports = function (req, res, next) {

	Promise.props({
		userAllCount: User.count().execAsync(),
		userAllActiveCount: User.count({active: true}).execAsync()
	})
		.then(function (results) {
			console.warn(results);
			let data = {
				title: 'Users',
				absolute_view: req.app.get('absolute_view'),
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
