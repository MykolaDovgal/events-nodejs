let Bar = require('models/Bar');
let config = require('config');
let default_image_event = config.get('images:default_image_lines');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Promise = require('bluebird');
let fs = require('fs');
let moment = require('moment');
let util = require('util/index');

Promise.promisifyAll(mongoose);

router.post('/scrollBars/:page?', function (req, res, next) {

	let limit = config.get('project:bars:limit_on_page') || 9;
	let search = req.query.search;
	let active = req.query.date;
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

	//search filter
	if (search !== undefined && search.length > 1) {
		let id = parseInt(search, 10);
		if (Number.isNaN(Number(id))) {
			id = 0;
		}

		let filter_search = [
			{'bar_name_eng': new RegExp(search, "i")},
			{'bar_name_ol': new RegExp(search, "i")},
			{'description_eng': new RegExp(search, "i")},
			{'description_ol': new RegExp(search, "i")},
			{'location.city': new RegExp(search, "i")},
			{'city.country': new RegExp(search, "i")}
		];

		if (id > 0) {
			filter_search.push({'id': id});
		}

		filter.push({$or: filter_search});
	}

	//city filter
	if (cities.length > 0) {
		filter.push(
			{
				'location.city': {$in: cities}
			}
		);
	}

	if (filter.length === 0) {
		filter.push({});
	}


	Promise.props({
		barCounter: Bar.countByDate(),
	})
		.then(function (results) {
			let barCounterResult = util.barCounterResult(results.barCounter);
			let active_filter = [];
			if (active && active.indexOf('open') > -1) {
				active_filter.push({'id': {$in: barCounterResult.openBarId}});
			}
			if (active && active.indexOf('close') > -1) {
				active_filter.push({'id': {$in: barCounterResult.closeBarId}});
			}

			if (active_filter.length > 0) {
				filter.push({$or: active_filter});
			}


			Promise.props({
				bars: Bar.paginate({$and: filter}, {page: page, limit: limit})
			}).then(function (results) {

				let bars = results.bars.docs;
				let data = {
					data: bars
				};
				res.json(data);
			}).catch(function (err) {
				next(err);
			});


		})
		.catch(function (err) {
			res.send(err);
		});


});

module.exports = router;