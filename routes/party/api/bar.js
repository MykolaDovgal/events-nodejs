let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');
let Party = require('models/Party');
let User = require('models/user');

router.get('/party/:id/bars', (req, res, next) => {
	Promise.props({
		parties: Party.findOne({ id: req.params.id }).select('bar').execAsync()
	}).then((results) => {
		let data = [];
		results.parties.bar.forEach((bar) => {
			data.push({
				_id: bar._id,
				bar_name_eng: bar.bar_name_eng ? bar.bar_name_eng : '',
				bar_name_ol: bar.bar_name_ol ? bar.bar_name_ol : ''
			});
		});

		res.json(data);
	}).catch((err) => {
		next(err)
	});
});

router.post('/party/bar/update', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.update({ 'bar': { $elemMatch: { _id: body.pk } } }, { '$set': { ['bar.$.' + body.name]: body['value'], } }).execAsync()
	}).then((results) => {
		res.status(200).send(body['value']);
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/add', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate({ id: body.partyId }, { $push: { bar: { bar_name_eng: body.name } } }).execAsync()
	}).then((results) => {
		Party.findOne({ id: body.partyId }).select('bar').then((doc) => {
			res.status(200).send(doc.bar[doc.bar.length - 1]._id);
		}).catch((err) => {
			next(err);
		});
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/delete', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate({ id: body.partyId }, { $pull: { bar: { _id: body.barId } } }).execAsync()
	}).then((results) => {
		res.status(200).send();
	}).catch((err) => {
		next(err);
	});
});

router.get('/party/:partyId/bar/:barId/tenders', (req, res, next) => {
	Promise.props({
		party: Party.findOne({ id: req.params.partyId }, 'bar')
	}).then((results) => {
		let bar = results.party.bar.find(bar => {
			return bar._id == req.params.barId; // barId, not the _id
		});

		User.find({
			id:
			{
				$in: bar.party_managers.map(object => {
					return object.userId;
				})
			}
		}).exec().then((results) => {
			results.forEach(function (user) {
				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user;
			});
			let data = { data: results };
			res.status(200).send(JSON.stringify(data));
		});
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/tenders/add', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.findOne({ id: parseInt(body.partyId) }, 'bar')
	}).then((results) => {
		results.party.bar.find((bar) => {
			return bar._id == body.barId;
		}).party_managers.push({ userId: body.userId });
		results.party.save();
		res.status(200).send();
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/tenders/delete', (req, res, next) => { // Haven't tested this yet
	let body = req.body;

	Promise.props({
		party: Party.findOne({ id: parseInt(body.partyId) }, 'bar')
	}).then((results) => {
		results.party.bar.find((bar) => {
			return bar._id == body.barId;
		}).party_managers.pull({ userId: body.userId });
		results.party.save();
		res.status(200).send();
	}).catch((err) => {
		next(err);
	});
});

router.get('/party/:partyId/bar/:barId/drinks', (req, res, next) => {
	Promise.props({
		party: Party.findOne({ id: req.params.partyId }).execAsync()
	}).then((results) => {
		let drinks = results.party.bar.find((bar) => {
			return bar._id == req.params.barId;
		}).drinks;
		let data = { data: drinks };
		res.status(200).send(JSON.stringify(data));
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/drink/add', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.findOne({ id: body.partyId }).execAsync()
	}).then((results) => {
		let bar = results.party.bar.find(function (bar) {
			return bar._id == body.barId
		}).drinks.push({ drinkname_eng: body.drinkName });
		results.party.save();
		res.status(200).send();
	}).catch((err) => {
		next(err);
	});
});

module.exports = router;
