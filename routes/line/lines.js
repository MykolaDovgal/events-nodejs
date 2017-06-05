/**
 * Created by Nazarii Beseniuk on 4/21/2017.
 */

let express = require('express');
let Promise = require('bluebird');

let Line = require('models/line');

let router = express.Router();

router.get('/lines', function (request, response, next) {

	Promise.props({
		addresses: Line.find({}, 'address').execAsync(),
		lineTotalCount: Line.count().execAsync(),
		lineActiveCount: Line.count({active: true}).execAsync(),
		lineUnActiveCount: Line.count({active: false}).execAsync()
	}).then(function (results) {
		let title_page = "Lines List";

		let addresses = [];
		results.addresses.forEach(function (line) {
			if (line.address && line.address.country)
				addresses.push(line.address);
		});

		let map = [];
		let uniqueCountry = new Set(addresses.map(address => address.country));

		for (let country of uniqueCountry.values())
			map.push({
				country: country,
				cities: [...new Set(addresses.filter((address) => address.country == country).map((address) => address.city))]
			});

		console.log(map);

		let data = {
			title: title_page,
			showMenu: true,
			lineTotalCount: results.lineTotalCount,
			lineActiveCount: results.lineActiveCount,
			lineUnActiveCount: results.lineUnActiveCount,
			addresses: map
		};

		response.render('pages/line/lines', data);
	}).catch(function (err) {
		next(err);
	});


});

module.exports = router;