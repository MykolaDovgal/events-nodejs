var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var _ = require('underscore');

require('rootpath')();

var User = require('models/user');
var Line = require('models/line');
let config = require('config');

var default_image_line = config.get('images:default_image_line');
var default_image_user = config.get('images:default_image_user');

var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);


let get_parties = require('./party/api/parties');
let get_prices = require('./party/api/prices');

router.use(get_parties);
router.use(get_prices);


router.get('/users', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync()
	})
		.then(function (results) {
			var lastActivities = [];

			results.users.map(function (user) {
				var lastActivity = user.getActivity()[user.getActivity().length - 1] ? user.getActivity()[user.getActivity().length - 1].login_time : '-';
				lastActivities.push(lastActivity);
				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture.includes('http'))
					user.profile_picture_circle = default_image_user;
				return user;
			});

			var users = [];

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

			var data = {
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
		var data = {
			data: results.user.getActivity()
		};

		res.json(data);
	}).catch(function (err) {
		next(err);
	});
});

router.post('/lines/:page?', function (req, res, next) {
	let limit = config.get('project:lines:limit_on_page') || 9;
	let search = req.query.search;
	let active = req.query.active;
	let addresses = req.query.address;
	let page = req.params.page || 1;

	delete req.query.search;

	let cities = [];

	if (addresses && addresses.length > 0) {
		cities = addresses.map((address) => {
			return JSON.parse(address).city;
		});
		console.log(cities);	
	}

	let filter = [];

	if (page < 1) {
		page = 1;
	}

	if (search !== undefined && search.length > 1) {
		var id = parseInt(search, 10);
		if (Number.isNaN(Number(id))) {
			id = 0;
		}

		var filter_search = [
			{'line_name_eng': new RegExp(search, "i")},
			{'line_name_eng': new RegExp(search, "i")},
			{'description_ol': new RegExp(search, "i")},
			{'description_eng': new RegExp(search, "i")},
			{'website': new RegExp(search, "i")},
			{'facebook_page': new RegExp(search, "i")},
			{'phone_number': new RegExp(search, "i")},
			{'address.city': new RegExp(search, "i")},
			{'address.country': new RegExp(search, "i")},
			{'music.music_genres': new RegExp(search, "i")}
		];

		if (id > 0) {
			filter_search.push({'id': id});
		}

		filter.push({ $or: filter_search });
	}

	if (active !== undefined) {
		filter.push({'active': active});
	}

	if (cities.length > 0) {
		filter.push(
			{
				'address.city': {$in: cities}
			}
		);
	}

	console.log(filter);

	if (filter.length === 0) {
		filter.push({});
	}


	Promise.props({
		lines: Line.paginate({$and: filter}, {page: page, limit: limit})
	}).then(function (results) {

		let lines = results.lines.docs;
		lines.forEach(function (line) {
			var cover_img = line.cover_picture;
			console.log(cover_img);
			if (cover_img !== undefined && cover_img.indexOf('http://') === -1 && cover_img.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + cover_img)) {
					line.cover_picture = default_image_line;
				}

			}
		});

		let data = {
			data: lines
		};

		res.json(data);
	}).catch(function (err) {
		next(err);
	});
});

//get line managers
router.get('/line/managers/:lineid?', function (req, res, next) {
	var lineid = req.params.lineid;

	if (lineid > 0) {
		Promise.props({
			managers: Line.findOne({id: lineid}).select('managers').lean()
		}).then(function (results) {
			var users = [];

			if( Array.isArray(results.managers.managers)){
				results.managers.managers.forEach(function (manager) {
					if (manager.user_id > 0) {
						users.push(manager.user_id);
					}
				});
			}

			User.find({
				'id': {$in: users}
			})
				.select(['id', 'username', 'profile_picture_circle', 'permission_level', 'realname'])
				.exec(function (err, users) {
					if (users === undefined) {
						users = [];
					}

					var data = {
						data: users
					};


					res.json(data);
				});


		}).catch(function (err) {
			next(err);
		});
	} else {
		next();
	}
});

//get user information to search
router.get('/users/usersname', function (req, res, next) {
	Promise.props({
		users: User.find({}).execAsync()
	})
		.then(function (results) {
			let data = [];

			results.users.forEach(function (user, index) {
				data.push({
					id: user.id,
					username: user.username,
					name: user.firstname + ' ' + user.lastname,
					picture: user.profile_picture
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

//add manager to line
router.post('/line/manager/add', function (req, res, next) {

	//TODO fix: add only one user
	let body = req.body;

	Promise.props({
		line: Line.update({id : body.lineId, "managers.user_id": { $nin: [ body.id ] } }, { $addToSet: {"managers": { user_id: body.id }},  }).execAsync()
	}).then(function (results) {
		res.send(200);
	})
		.catch(function (err) {
			next(err);
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
