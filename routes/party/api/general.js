let express = require('express');
let Promise = require('bluebird');
let crypto = require('crypto');

let config = require('config');
let default_image_user = config.get('images:default_image_user');


let Party = require('models/Party');
let User = require('models/user');

let router = express.Router();


router.get('/party/:id/managers', function (req, res, next) {

	Promise.props({
		managers: Party.findOne({'id':  req.params.id}).select('party_managers').execAsync()
	}).then(function (results) {

		let array = [];

		results.managers.party_managers.forEach(managerId => {
			 array.push(managerId.userId)
		});


		User.find({
			id : {$in: array }
		}).exec().then((results) => {
			let users = [];

			results.forEach((user) => {

				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user;

				users.push({
					profile_picture_circle: user.profile_picture_circle,
					id: user.id,
					username: user.username,
					permission_level: user.permission_level
				});

			});
			res.status(200).send({data: users});
		});

	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/manager/add', function (req, res, next) {


	console.warn('asdasdas');
	console.warn(req.body);

	let body = req.body;

	Promise.props({
		party: Party.update({
			id: req.params.id,
			"party_managers.userId": {$nin: [body.id]}
		}, {$addToSet: {"party_managers": {userId: body.id}},}).execAsync()
	}).then(function (results) {
		res.send(200);
	})
		.catch(function (err) {
			next(err);
		});

});



module.exports = router;