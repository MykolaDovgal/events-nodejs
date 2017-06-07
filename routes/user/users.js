'use strict';

/**
 * Module dependencies.
 */
let _ = require('underscore');
let express = require('express');
let User = require('models/User');
let Promise = require('bluebird');
let router = express.Router();


router.get('/users', function (req, res, next) {

	Promise.props({
		userAllCount: User.count().execAsync(),
		userAllActiveCount: User.count({active: true}).execAsync()
	})
		.then(function (results) {
			let data = {
				title: 'Users',
				absolute_view: req.app.get('absolute_view'),
				showMenu: true,
				userAllCount: results.userAllCount,
				userAllActiveCount: results.userAllActiveCount
			};
			res.render('pages/user/users', data);
		})
		.catch(function (err) {
			res.send(500);
		});
});

module.exports = router;
