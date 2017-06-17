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



module.exports = router;
