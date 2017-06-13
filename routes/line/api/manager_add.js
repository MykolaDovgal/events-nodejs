let express = require('express');
let Promise = require('bluebird');

let router = express.Router();

let Line = require('models/Line');
let Party = require('models/Party');


let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');


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

module.exports = router;