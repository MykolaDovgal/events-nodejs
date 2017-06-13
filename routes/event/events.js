let express = require('express');
let Promise = require('bluebird');
let Event = require('models/Event');
let router = express.Router();

router.get('/events', function (req, res, next) {

    Promise.props({
        addresses: Event.find({}, 'location').execAsync(),
        eventTotalCount: Event.count().execAsync(),
        eventCountToday: Event.countByDate(),
        eventCountPast: Event.countByDate('lt'),
        eventCountFuture: Event.countByDate('gt')
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

        let data = {
            title: "Events",
            showMenu: true,
            eventTotalCount: results.eventTotalCount,
            eventCountToday: results.eventCountToday,
            eventCountPast: results.eventCountPast,
            eventCountFuture: results.eventCountFuture,
            addresses: map
        };

        res.render('pages/event/events', data);
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