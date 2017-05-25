let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');

router.get('/party/:id/bars', function (req, res, next) {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('bar').execAsync()
	})
		.then(function (results) {
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
		.catch(function (err) {
			next(err)
		});
});

router.post('/party/bar/update',function (req, res, next) {

	console.warn(req.body);

	let body = req.body;

	Promise.props({
		party: Party.update({ 'bar': {$elemMatch: {_id: body.pk}} }, { '$set': {['bar.$.' + body.name]: body['value'],}}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/bar/add',function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate( {id: body.partyId }, {$push : {'bar' : {} }}).execAsync()
	}).then(function (results) {

		Party.findOne({ id: body.partyId }).select('bar')
			.then(function(doc){
				res.status(200).send(doc.bar[doc.bar.length - 1]._id);
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

	res.send(200);

	// let body = req.body;
	//
	// Promise.props({
	// 	party: Party.update( {'tkt_price':{$elemMatch: {_id: body.priceId}} }, {$pull : { tkt_price : {_id : body.priceId}  } } ).execAsync()
	// }).then(function (results) {
	// 	res.status(200);
	// })
	// 	.catch(function (err) {
	// 		next(err);
	// 	});



});



module.exports = router;
