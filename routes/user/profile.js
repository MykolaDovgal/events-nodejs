'use strict';
let fs = require('fs');
let _ = require('underscore');
let express = require('express');
let mongoose = require('mongoose');
let Promise = require('bluebird');
let moment = require('moment');
let config = require('config');
let router = express.Router();

let default_image_user = config.get('images:default_image_user');

Promise.promisifyAll(mongoose);

let User = require('models/User');


router.get('/users/:id?', function (req, res, next) {

	Promise.props({
		user: User.findOne({id: req.params.id}).execAsync()
	})
		.then(function (results) {
			let user = results.user;
			let title_page = user.username + "'s Profile";

			user.profile_picture_circle = user.image_circle;

			let data = {
				title: title_page,
				showMenu: true,
				user: user,
				dateOfBirth: moment(user.date_of_birth).format('DD.MM.YYYY')
			};

			res.render('pages/user/profile', data);
		})
		.catch(function (err) {
			next(err);
		});
});

module.exports = router;