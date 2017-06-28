let express = require('express');
let Promise = require('bluebird');


let config = require('config');
let fs = require('fs');
let default_image_user = config.get('images:default_image_user');


let Event = require('models/Event');
let User = require('models/User');
let Party = require('models/Party');

let router = express.Router();


router.get('/event/:id/managers', function (req, res, next) {

	Promise.props({
		managers: Event.findOne({'id': req.params.id}).select('managers').execAsync()
	}).then(function (results) {

		let permissionLevelHashArray = [];
		let userIdArray = [];

		results.managers.managers.forEach(managerId => {
			userIdArray.push(managerId.userId);
			permissionLevelHashArray[managerId.userId] = managerId.permission_level;
		});


		User.find({
			id: {$in: userIdArray}
		}).exec().then((results) => {
			let users = [];

			results.forEach((user) => {
				users.push({
					profile_picture_circle: user.image_circle,
					id: user.id,
					username: user.username,
					permission_level: permissionLevelHashArray[user.id]
				});

			});
			res.status(200).send({data: users});
		});

	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/event/manager/delete', function (req, res, next) {
	let body = req.body;
	Promise.props({
		event: Event.update({id: body.eventId}, {$pull: {managers: {userId: body.userId}}}).execAsync()
	}).then(function (results) {
		res.sendStatus(200);
	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/event/manager/update', function (req, res, next) {

	let body = req.body;
	Promise.props({
		event_update: Event.findOneAndUpdate(
			{
				id: body.eventId,
				'managers': {$elemMatch: {userId: body.pk}}
			},
			{
				'managers.$.permission_level': body['value']
			}
		).execAsync(),
		party_update: Party.update(
			{
				eventId: body.eventId,
				'party_managers': {$elemMatch: {userId: body.pk}}
			},
			{
				$set: {'party_managers.$.permission_level': body['value']}
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