let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');

router.get('/party/prices/:id', function (req, res, next) {

	Promise.props({
		parties: Party.findOne({id: req.params.id}).select('tkt_price').execAsync()
	})
		.then(function (results) {
			let data = [];

			//console.warn(results.parties.tkt_price[0].start_date);

			results.parties.tkt_price.forEach( (tkts) => {
				data.push({
					delete_button: null,
					start_date: moment(tkts.start_date).format('DD/MM/YYYY HH:mm'),
					end_date:  moment(tkts.end_date).format('DD/MM/YYYY HH:mm'),
					price: tkts.price,
					currency: tkts.currency
				});
			});

			let temp = {data: data};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;
