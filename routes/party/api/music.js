let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');
let User = require('models/user');

let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');

router.get('/party/:id/music/stages', function (req, res, next) {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('stage').execAsync()
	})
		.then(function (results) {
			let data = [];
			results.parties.stage.forEach((stage) => {
				data.push({
					_id: stage._id,
					stage_name: stage.stage_name ? stage.stage_name : '',
					music_genres: stage.music_genres
				});
			});

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

router.post('/party/music/stage/update', function (req, res, next) {


	let body = req.body;

	let val;
	if (body['value'])
		val = body['value'];
	else
		val = body['value[]'];

	Promise.props({
		party: Party.update({'stage': {$elemMatch: {_id: body.pk}}}, {'$set': {['stage.$.' + body.name]: val,}}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/music/stage/add', function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate({id: body.partyId}, {$push: {'stage': {}}}).execAsync()
	}).then(function (results) {

		Party.findOne({id: body.partyId}).select('stage')
			.then(function (doc) {
				doc.stage[doc.stage.length - 1].djs = [];
				res.status(200).send({
					stage_name: '',
					_id: doc.stage[doc.stage.length - 1]._id
				});
			})
			.catch(function (err) {
				next(err);
			});

	})
		.catch(function (err) {
			next(err);
		});


});

router.post('/party/music/stage/delete', function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.update({'stage': {$elemMatch: {_id: body._id}}}, {$pull: {stage: {_id: body._id}}}).execAsync()
	}).then(function (results) {
		res.status(200).send('OK');
	})
		.catch(function (err) {
			next(err);
		});

});

router.get('/party/music/stage/:id/djs', function (req, res, next) {

	Promise.props({
		stages: Party.findOne({'stage': {$elemMatch: {_id: req.params.id}}}).select('stage').execAsync()
	}).then(function (stageResults) {

		let array = [];

		let stageItem = stageResults.stages.stage.find(stage => {
			return stage._id == req.params.id;
		});

		stageItem.djs.forEach((dj) => array.push(dj.userId));

		User.find({
			id : {$in: array }
		}).exec().then((results) => {
			let users = [];

			results.forEach((user) => {
				let soundcloud = stageItem.djs.find((dj)=> {
					if( dj.userId == user.id)
						return dj.soundcloud;
				});

				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user;

				users.push({
					profile_picture_circle: user.profile_picture_circle,
					id: user.id,
					username: user.username,
					name: user.realname,
					soundcloud: soundcloud || 'link'
				})
			});
			res.status(200).send({data: users});
		});


	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/music/stage/djs/add', function (req, res, next) {

	//TODO fix: add only one user
	let body = req.body;
	Promise.props({
		party : Party.findOne(   {'stage._id' : body.stageId}, 'stage').execAsync()
	}).then(function (results) {
		results.party.stage.find((stage) => {
			return stage._id == body.stageId;
		}).djs.push({ userId: body.id });
		results.party.save();
		res.status(200).send();
	})
		.catch(function (err) {
			next(err);
		});

});

router.post('/party/music/stage/djs/delete', function (req, res, next) {

	console.warn(req.body);

	res.send(200);

	// //TODO fix: add only one user
	// let body = req.body;
	// console.warn(body);
	// Promise.props({
	// 	party : Party.findOne(   {'stage._id' : body.stageId}, 'stage').execAsync()
	// }).then(function (results) {
	// 	console.log(results);
	// 	console.log(results.party.stage);
	// 	results.party.stage.find((stage) => {
	// 		return stage._id == body.stageId;
	// 	}).djs.push({ userId: body.id });
	// 	console.warn({ userId: body.id });
	// 	results.party.save();
	// 	res.status(200).send();
	// })
	// 	.catch(function (err) {
	// 		next(err);
	// 	});

});


module.exports = router;