/**
 * Created by Nazarii Beseniuk on 4/21/2017.
 */

var express = require('express');
var Promise = require('bluebird');

var chunks = require('array.chunk');

var Line = require('models/line');

var router = express.Router();

router.get('/lines', function (request, response, next) {

    Promise.props({
        addresses: Line.find({}, 'address').execAsync(),
        lineTotalCount: Line.count().execAsync(),
        lineActiveCount: Line.count({active: true}).execAsync(),
        lineUnActiveCount: Line.count({active: false}).execAsync()
    }).then(function (results) {
        var title_page = "Lines List";

        var addresses = [];
        results.addresses.forEach(function(line) {
            if (line.address && line.address.country)
                addresses.push(line.address);
        });

        console.log(addresses);

        let map = [];
        let uniqueCountry = new Set(addresses.map(address => address.country));

        for(let country of uniqueCountry.values())
            map.push({country: country, cities: [...new Set(addresses.filter((address) => address.country == country).map((address) => address.city))]});

        console.log(map);

        var data = {
            title: title_page,
            showMenu: true,
            lineTotalCount: results.lineTotalCount,
            lineActiveCount: results.lineActiveCount,
            lineUnActiveCount: results.lineUnActiveCount,
            addresses: map
        };

        response.render('pages/lines', data);
    }).catch(function (err) {
        next(err);
    });


});

module.exports = router;