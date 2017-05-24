let express = require('express');
let Promise = require('bluebird');


let Party = require('models/Party');

let router = express.Router();

router.get('/parties', function (request, response, next) {

	Promise.props({
		addresses: Party.find({}, 'location').execAsync(),
		partyTotalCount: Party.count().execAsync(),
        partyActiveCount: Party.count({active: true}).execAsync(),
        partyUnActiveCount: Party.count({active: false}).execAsync()
	}).then(function (results) {

 		var addresses = [];
        results.addresses.forEach(function(party) {
            if (party.location.city && party.location.country)
                addresses.push({country: party.location.country, city: party.location.city });
        });

        console.log('ADDRESSES\n', addresses);

        let map = [];
        let uniqueCountry = new Set(addresses.map(address => address.country));

        for(let country of uniqueCountry.values())
            map.push({country: country, cities: [...new Set(addresses.filter((address) => address.country == country).map((address) => address.city))]});

		let data = {
			title: "Parties",
			showMenu: true,
			partyTotalCount: results.partyTotalCount,
            partyActiveCount: results.partyActiveCount,
            partyUnActiveCount: results.partyUnActiveCount,
			addresses: map
		};

		response.render('pages/party/partiesList', data);
	}).catch(function (err) {
		next(err);
	});

});

module.exports = router;