let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let User = require('models/User');


router.get('/users', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync()
	})
		.then(function (results) {
			let lastActivities = [];

			results.users.map(function (user) {
				let lastActivity = user.getActivity()[user.getActivity().length - 1] ? user.getActivity()[user.getActivity().length - 1].login_time : '-';
				lastActivities.push(lastActivity);
				user.profile_picture_circle = user.image_circle;
				return user;
			});

			let users = [];

			//TODO FIX THIS IMMEDIATELY
			results.users.forEach(function (user, index) {
				users.push({
					id: user.id,
					username: user.username,
					realname: user.realname,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					profile_picture: user.profile_picture,
					profile_picture_circle: user.profile_picture_circle,
					about: user.about,
					date_of_birth: user.date_of_birth,
					facebook_profile: user.facebook_profile,
					active: user.active,
					lastActivity: lastActivities[index],
					//fake data for table
					bars: Math.floor(Math.sin(user.id).toString().substr(17)),
					events: Math.floor(Math.sin(user.id).toString().substr(18)),
					lines: Math.floor(Math.sin(user.id).toString().substr(17) / 2),
				});
			});

			let data = {
				data: users,
			};

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

router.get('/activity/:id?', function (req, res, next) {
	Promise.props({
		user: User.findOne({id: req.params.id})
	}).then(function (results) {
		let data = {
			data: results.user.getActivity()
		};

		res.json(data);
	}).catch(function (err) {
		next(err);
	});
});


module.exports = router;

