var Event = require('models/Event');
var config = require('config');
var default_image_line = config.get('images:default_image_line');
let express = require('express');
let router = express.Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var fs = require('fs');


Promise.promisifyAll(mongoose);

router.post('/events/:page?', function (req, res, next) {
    let limit = config.get('project:events:limit_on_page') || 9;
    let search = req.query.search;
    let active = req.query.active;
    let addresses = req.query.address;
    let page = req.params.page || 1;

    delete req.query.search;

    let cities = [];

    if (addresses && addresses.length > 0) {
        cities = addresses.map((address) => {
            return JSON.parse(address).city;
        });
    }

    let filter = [];

    if (page < 1) {
        page = 1;
    }

    if (search !== undefined && search.length > 1) {
        var id = parseInt(search, 10);
        if (Number.isNaN(Number(id))) {
            id = 0;
        }

        var filter_search = [
            { 'event_name_eng': new RegExp(search, "i") },
            { 'event_name_eng': new RegExp(search, "i") },
            { 'description_ol': new RegExp(search, "i") },
            { 'description_eng': new RegExp(search, "i") },
            { 'website': new RegExp(search, "i") },
            { 'facebook_page': new RegExp(search, "i") },
            { 'phone_number': new RegExp(search, "i") },
            { 'location.city': new RegExp(search, "i") },
            { 'location.country': new RegExp(search, "i") },
            { 'music.music_genres': new RegExp(search, "i") }
        ];

        if (id > 0) {
            filter_search.push({ 'id': id });
        }

        filter.push({ $or: filter_search });
    }

    if (active !== undefined) {
        filter.push({ 'active': active });
    }

    if (cities.length > 0) {
        filter.push(
            {
                'address.city': { $in: cities }
            }
        );
    }

    console.log(filter);

    if (filter.length === 0) {
        filter.push({});
    }


    Promise.props({
        events: Event.paginate({ $and: filter }, { page: page, limit: limit })
    }).then(function (results) {

        let events = results.events.docs;
        events.forEach(function (event) {
            var cover_img = event.cover_picture;
            if (cover_img !== undefined && cover_img.indexOf('http://') === -1 && cover_img.indexOf('https://') === -1) {
                if (!fs.existsSync('public' + cover_img)) {
                    event.cover_picture = default_image_event;
                }

            }
        });

        let data = {
            data: events
        };

        res.json(data);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;