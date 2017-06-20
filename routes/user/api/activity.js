let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let User = require('models/User');
let Bar = require('models/Bar');
let Line = require('models/Line');
let Party = require('models/Party');
let Event = require('models/Event');


router.get('/users', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync(),
		bar: Bar.find({}, 'managers').execAsync(),
		event: Event.find({}, 'managers').execAsync(),
		line: Line.find({}, 'managers').execAsync()
	})
		.then(function (results) {
			let lastActivities = [];
			let users = [];
			let userIdArray = [];

			results.users.map(function (user) {
				let lastActivity = user.getActivity()[user.getActivity().length - 1] ? user.getActivity()[user.getActivity().length - 1].login_time : '-';
				lastActivities.push(lastActivity);
				user.profile_picture_circle = user.image_circle;
				userIdArray.push(user.id);
				return user;
			});

			let barManagersCount = getManagerCount(results.bar, userIdArray);
			let eventManagersCount = getManagerCount(results.event, userIdArray);
			let lineManagersCount = getManagerCount(results.line, userIdArray, 'user_id');

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
					bars: barManagersCount['id' + user.id] || 0,
					events: eventManagersCount['id' + user.id] || 0,
					lines: lineManagersCount['id' + user.id] || 0
				});

			});
			res.json({data: users});
		})
		.catch(function (err) {
			next(err)
		})
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

let getManagerCount = function (arr, userIdArr, fieldName = 'userId') {
	let resArray = [];
	userIdArr.forEach((userId) => {
		arr.forEach((managers) => {
			if (!managers.length && managers.managers.some((manager) => manager[fieldName] === userId)) {
				resArray['id' + userId] = resArray['id' + userId] ? resArray['id' + userId] += 1 : 1;
			}
		});
	});
	return resArray;
};

module.exports = router;

