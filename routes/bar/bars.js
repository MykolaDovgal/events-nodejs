let express = require('express');
let Promise = require('bluebird');
let Bar = require('models/Bar');
let router = express.Router();
let util = require('util/index');

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
		let uniqueCountryArray = Array.from(uniqueCountry).sort(alphabetSort);

		for (let country of uniqueCountryArray)
			map.push({
				country: country,
				cities: [...new Set(addresses.filter((address) => address.country == country).map((address) => address.city))]
			});

		let barCounterResult = util.barCounterResult(results.barCounter);
		let data = {
			title: "Bars",
			showMenu: true,
			barCountOpen: barCounterResult.open,
			barCountClose: barCounterResult.close,
			addresses: map
		};


		res.render('pages/bar/bars', data);
	}).catch(function (err) {
		next(err);
	});

});

let alphabetSort = (firstStr,secondStr) => {
	if (firstStr > secondStr)
		return 1;
	if (firstStr <secondStr)
		return -1;
	return 0;
};

module.exports = router;