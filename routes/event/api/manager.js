let express = require('express');
let Promise = require('bluebird');

let router = express.Router();

let Event = require('models/Event');
let Party = require('models/Party');


let config = require('config');
let default_image_user = config.get('images:default_image_user');


router.post('/event/manager/add', function (req, res, next) {
	let body = req.body;

	Promise.props({
		event: Event.update({
			id: body.lineId,
			"managers.userId": {$nin: [body.id]}
		}, {$addToSet: {"managers": {userId: body.id}},}).execAsync()
	}).then(function (results) {
		res.send(200);
	})
		.catch(function (err) {
			next(err);
		});

});


//add manager to event's parties
router.post('/event/manager/addToParties', function (req, res, next) {

	let body = req.body;
	let userId = parseInt(body.userId);
	let eventId = parseInt(body.eventId);


	if (userId > 0 && eventId > 0) {

		Promise.props({
			update: Party.update(
				{
					eventId: eventId,
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

module.exports = router;