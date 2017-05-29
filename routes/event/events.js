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
        var addresses = [];
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

module.exports = router;