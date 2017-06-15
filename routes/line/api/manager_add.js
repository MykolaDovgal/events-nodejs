let express = require('express');
let Promise = require('bluebird');

let router = express.Router();

let Line = require('models/Line');
let Party = require('models/Party');
let User = require('models/User');


let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');

//get line managers
router.get('/line/managers/:lineid?', function (req, res, next) {

	let lineid = req.params.lineid;

	let permissionLevelHashArray = [];
	let userIdArray = [];

	if (lineid > 0) {
		Promise.props({
			managers: Line.findOne({id: lineid}).select('managers').lean()
		}).then(function (results) {


			if (Array.isArray(results.managers.managers)) {
				results.managers.managers.forEach(function (manager) {
					if (manager.user_id > 0) {
						userIdArray.push(manager.user_id);
						permissionLevelHashArray[manager.user_id] = manager.permission_level;
					}
				});
			}

			User.find({
				'id': {$in: userIdArray}
			})
				.select(['id', 'username', 'profile_picture_circle', 'permission_level', 'realname'])
				.exec(function (err, users) {
					if (users === undefined) {
						users = [];
					}

					users.forEach(function (user) {
						if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
							user.profile_picture_circle = default_image_user;
						user.permission_level = permissionLevelHashArray[user.id];
					});

					let data = {
						data: users
					};


					res.json(data);
				});


		}).catch(function (err) {
			next(err);
		});
		``
	} else {
		next();
	}
});

//add manager to line
router.post('/line/manager/add', function (req, res, next) {

	let body = req.body;
	let userId = +body.id;

	if (userId > 0) {
		Promise.props({
			line: Line.findOneAndUpdate({
				id: body.lineId,
				"managers.user_id": {$nin: [userId]}
			}, {$addToSet: {"managers": {user_id: userId}},}).execAsync()
		}).then(function (results) {
			results.userId = userId;
			res.json(results);
		})
			.catch(function (err) {
				next(err);
			});

	} else {
		next();
	}

});

//add manager to line's parties
router.post('/line/manager/addToParties', function (req, res, next) {

	let body = req.body;
	let userId = parseInt(body.userId);
	let lineId = parseInt(body.lineId);


	if (userId > 0 && lineId > 0) {

		Promise.props({
			update: Party.update(
				{
					lineId: lineId,
					'party_managers.userId': {$nin: [userId]}
				},
				{
					$addToSet: {'party_managers': {userId: userId}}
				},
				{'multi': true}
			).execAsync()
		}).then(function (results) {
			results.userId = userId;
			res.json(results);
		})
			.catch(function (err) {
				next(err);
			});

	} else {
		next();
	}

});


router.post('/line/manager/update', function (req, res, next) {

	let body = req.body;
	Promise.props({
		line_update: Line.findOneAndUpdate(
			{
				id: body.lineId,
				'managers': {$elemMatch: {user_id: body.pk}}
			},
			{
				'managers.$.permission_level': body['value']
			}
		).execAsync(),
		party_update: Party.update(
			{
				lineId: body.lineId,
				'party_managers': {$elemMatch: {userId: body.pk}}
			},
			{
				$set: {'party_managers.$.permission_level' : body['value']}
			},
			{'multi': true}
		).execAsync()

	}).then(function (results) {
		res.sendStatus(200);
	})
		.catch(function (err) {
			next(err);
		});
});

module.exports = router;