let express = require('express');
let router = express.Router();
let passport = require('passport');
let fs = require('fs');
let _ = require('underscore');

require('rootpath')();

let User = require('models/User');
let Line = require('models/Line');
let config = require('config');

let default_image_line = config.get('images:default_image_line');
let default_image_user = config.get('images:default_image_user');

let mongoose = require('mongoose');
let Promise = require('bluebird');

Promise.promisifyAll(mongoose);


let parties = require('./party/api/parties');
let prices = require('./party/api/prices');
let attendees = require('./party/api/attendees');
let music = require('./party/api/music');
let bar = require('./party/api/bar');
let general = require('./party/api/general');
let apiParties = require('./party/api/apiParties');


let events = require('./event/api/events');

let notifications = require('./event/api/notifications');

let followers = require('./line/api/followers');
let line_parties = require('./line/api/parties');


router.use(followers);
router.use(line_parties);


router.use(apiParties);
router.use(general);
router.use(parties);
router.use(prices);
router.use(attendees);
router.use(music);
router.use(bar);


router.use(notifications);
router.use(events);


router.get('/users', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync()
	})
		.then(function (results) {
			let lastActivities = [];

			results.users.map(function (user) {
				let lastActivity = user.getActivity()[user.getActivity().length - 1] ? user.getActivity()[user.getActivity().length - 1].login_time : '-';
				lastActivities.push(lastActivity);
				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user;
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




//get user information to search
router.get('/users/usersname', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync()
	})
		.then(function (results) {
			let data = [];


			results.users.forEach(function (user, index) {

				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user;

				data.push({
					id: user.id,
					username: user.username,
					name: user.firstname + ' ' + user.lastname,
					picture: user.profile_picture_circle
				});
			});

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

//return lines where user is manager
router.get('/user/lines/:id?', function (req, res, next) {
	Promise.props({
		lines: Line.find({
			'managers': {$elemMatch: {user_id: {$in: [req.params.id]}}}
		}).execAsync()
	})
		.then(function (results) {
			let lines = [];

			results.lines.forEach(function (line, index) {
				lines.push({
					id: line.id,
					name: line.line_name_eng,
					country: line.address.country,
					city: line.address.city
				});
			});

			let data = {
				data: lines
			};
			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});


//delete manager from line
router.post('/line/manager/delete', function (req, res, next) {
	Promise.props({
		line: Line.update({id: req.body.lineId}, {$pull: {managers: {user_id: req.body.userId}}}).execAsync()
	}).then(function (results) {
		res.send(200);
	})
		.catch(function (err) {
			console.log(err);
			next(err);
		});
});

module.exports = router;
