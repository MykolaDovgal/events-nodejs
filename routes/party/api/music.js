let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');

router.get('/party/:id/music/stages', function (req, res, next) {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('stage').execAsync()
	})
		.then(function (results) {
			let data = [];
			results.parties.stage.forEach((stage) => {
				data.push({
					_id: stage._id,
					stage_name: stage.stage_name ? stage.stage_name : ''
				});
			});

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

router.post('/party/music/stage/update',function (req, res, next) {

	console.warn(req.body);

	let body = req.body;

	Promise.props({
		party: Party.update({ 'stage': {$elemMatch: {_id: body.pk}} }, { '$set': {['stage.$.' + body.name]: body['value'],}}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/music/stage/add',function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate( {id: body.partyId }, {$push : {'stage' : {} }}).execAsync()
	}).then(function (results) {

		Party.findOne({ id: body.partyId }).select('stage')
			.then(function(doc){
				res.status(200).send(doc.stage[doc.stage.length - 1]._id);
			})
			.catch(function (err){
				next(err);
			});

	})
		.catch(function (err) {
			next(err);
		});



});

router.post('/party/music/stage/delete',function (req, res, next) {
	let body = req.body;
	console.warn(body);
	Promise.props({
		party: Party.update( {'stage':{$elemMatch: {_id: body._id}} }, {$pull : { stage : {_id : body._id}  } } ).execAsync()
	}).then(function (results) {
		console.warn('asdasdasdasdas');
		res.status(200).send('OK');
	})
		.catch(function (err) {
			next(err);
		});

});





module.exports = router;
