let express = require('express');
let Promise = require('bluebird');
let Bar = require('models/Bar');
let router = express.Router();

router.get('/bars', function (req, res, next) {


	Promise.props({
		addresses: Bar.find({}, 'location').execAsync(),
		barCounter: Bar.countByDate()
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

		let barCounter = results.barCounter;
		let data = {
			title: "Bars",
			showMenu: true,
			barCountOpen: barCounter.open,
			barCountClose: barCounter.close,
			barCountAll: barCounter.all,
			addresses: map
		};


		res.render('pages/bar/bars', data);
	}).catch(function (err) {
		next(err);
	});

});

module.exports = router;