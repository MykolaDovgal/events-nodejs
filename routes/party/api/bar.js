let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');

router.get('/party/:id/bars', (req, res, next) => {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('bar').execAsync()
	})
		.then((results) => {
			let data = [];
			results.parties.bar.forEach((bar) => {
				data.push({
					_id: bar._id,
					bar_name_eng: bar.bar_name_eng ? bar.bar_name_eng : '',
					bar_name_ol: bar.bar_name_ol ? bar.bar_name_ol : ''
				});
			});

			res.json(data);
		})
		.catch((err) => {
			next(err)
		});
});

router.post('/party/bar/update', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.update({ 'bar': {$elemMatch: {_id: body.pk}} }, { '$set': {['bar.$.' + body.name]: body['value'],}}).execAsync()
	}).then((results) => {
		res.status(200).send(body['value']);
	})
		.catch((err) => {
			next(err);
		});
});

router.post('/party/bar/add', (req, res, next) => {
	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate( {id: body.partyId }, {$push : {'bar' : {} }}).execAsync()
	}).then((results) => {
		Party.findOne({ id: body.partyId }).select('bar').then((doc) => {
			res.status(200).send(doc.bar[doc.bar.length - 1]._id);
		}).catch((err) =>{
			next(err);
		});
	}).catch((err) => {
		next(err);
	});
});

router.post('/party/bar/delete',(req, res, next) => {
	let body = req.body;
	
	Promise.props({
		party: Party.findOneAndUpdate( { id: body.partyId }, { $pull : { bar : {_id : body.barId} } } ).execAsync()
	}).then((results) => {
		res.status(200).send();
	}).catch((err) => {
		next(err);
	});
});

module.exports = router;
