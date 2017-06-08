let Event = require('models/Event');
let config = require('config');
let default_image_event = config.get('images:default_image_event');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Promise = require('bluebird');
let fs = require('fs');
let moment = require('moment');


Promise.promisifyAll(mongoose);

router.post('/events/:page?', function (req, res, next) {
	let limit = config.get('project:events:limit_on_page') || 9;
	let search = req.query.search;
	let active = req.query.active;
	let addresses = req.query.address;
	let page = req.params.page || 1;

	let date = Date.now();
	let string_from = moment(date).format('YYYY-MM-DD');

	let from = new Date(string_from); // today
	let to = moment(from).add(1, 'd').toDate(); // tomorrow

	let date_filter = req.query.date ? req.query.date : [];


	delete req.query.search;

	let cities = [];

	if (addresses && addresses.length > 0) {
		cities = addresses.map((address) => {
			return JSON.parse(address).city;
		});
	}

	let filter = [];

	let condition_date_filter = [];
	if (date_filter.length > 0) {
		date_filter.forEach(function (d_filter) {
			let cond;
			switch (d_filter) {
				case 'today':
					cond = {$gt: from, $lt: to};
					break;
				case 'future':
					cond = {$gt: to};
					break;
				case 'past':
					cond = {$lt: from};
			}
			if (cond) {
				condition_date_filter.push(
					{
						'start_date': cond
					}
				);
			}
		});
	}

	if (page < 1) {
		page = 1;
	}

	if (search !== undefined && search.length > 1) {
		let id = parseInt(search, 10);
		if (Number.isNaN(Number(id))) {
			id = 0;
		}

		let filter_search = [
			{'title_ol': new RegExp(search, "i")},
			{'title_eng': new RegExp(search, "i")},
			{'description_ol': new RegExp(search, "i")},
			{'description_eng': new RegExp(search, "i")},
			{'location.city': new RegExp(search, "i")},
			{'city.country': new RegExp(search, "i")}
		];

		if (id > 0) {
			filter_search.push({'id': id});
		}

		filter.push({$or: filter_search});
	}

	if (active !== undefined) {
		filter.push({'active': active});
	}

	if (cities.length > 0) {
		filter.push(
			{
				'location.city': {$in: cities}
			}
		);
	}

	if (condition_date_filter.length > 0) {
		filter.push({
			$or: condition_date_filter
		});
	}


	if (filter.length === 0) {
		filter.push({});
	}

	let sort = {start_date: 1};

	Promise.props({
		events: Event.paginate({$and: filter}, {page: page, limit: limit, sort})
	}).then(function (results) {

		let events = results.events.docs;
		events.forEach(function (event) {
			event.cover_picture = event.image;
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