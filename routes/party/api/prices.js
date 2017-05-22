let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');

router.get('/party/:id/prices', function (req, res, next) {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('tkt_price').execAsync()
	})
		.then(function (results) {
			let data = [];


			results.parties.tkt_price.forEach( (tkts) => {
				console.warn(tkts.currency);
				data.push({
					delete_button: null,
					id: tkts._id,
					start_date: tkts.start_date ? moment(tkts.start_date).format('DD/MM/YYYY HH:mm') : '',
					end_date: tkts.end_date ? moment(tkts.end_date).format('DD/MM/YYYY HH:mm') : '',
					price: tkts.price,
					currency: tkts.currency ? tkts.currency : ''
				});
			});

			let temp = {data: data};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});

router.post('/party/prices/update',function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.update({ 'tkt_price':{$elemMatch: {_id: body.priceId}} }, {'$set': {['tkt_price.$.' + body.name]: body['value'],}}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			next(err);
		});
});

router.post('/party/prices/add',function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.findOneAndUpdate( {id: body.partyId }, {$push : {'tkt_price' : {} }}).execAsync()
	}).then(function (results) {

		Party.findOne({ id: body.partyId }).select('tkt_price')
			.then(function(doc){
				res.status(200).send(doc.tkt_price[doc.tkt_price.length - 1]._id);
			})
			.catch(function (err){
				next(err);
			});
	})
		.catch(function (err) {
			next(err);
		});



});

router.post('/party/prices/delete',function (req, res, next) {

	let body = req.body;

	Promise.props({
		party: Party.update( {'tkt_price':{$elemMatch: {_id: body.priceId}} }, {$pull : { tkt_price : {_id : body.priceId}  } } ).execAsync()
	}).then(function (results) {
		res.status(200);
	})
		.catch(function (err) {
			next(err);
		});



});



module.exports = router;
