let express = require('express');
let Promise = require('bluebird');
let Bar = require('models/Bar');
let router = express.Router();

router.get('/bars', function (req, res, next) {


	Promise.props({
		addresses: Bar.find({}, 'location').execAsync(),
	}).then(function (results) {
		let addresses = [];
		results.addresses.forEach(function (event) {
			if (event.location.city && event.location.country)
				addresses.push({ country: event.location.country, city: event.location.city });
		});

		let map = [];
		let uniqueCountry = new Set(addresses.map(address => address.country));

		for (let country of uniqueCountry.values())
			map.push({
				country: country,
				cities: [...new Set(addresses.filter((address) => address.country == country).map((address) => address.city))]
			});

		let data = {
			title: "Bars",
			showMenu: true,
			eventTotalCount: results.eventTotalCount,
			eventCountToday: results.eventCountToday,
			eventCountPast: results.eventCountPast,
			eventCountFuture: results.eventCountFuture,
			addresses: map
		};


		res.render('pages/bar/bars', data);
	}).catch(function (err) {
		next(err);
	});

});

module.exports = router;