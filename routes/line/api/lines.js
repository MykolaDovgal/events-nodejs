let express = require('express');
let Promise = require('bluebird');
let moment = require('moment');
let fs = require('fs');

let config = require('config');

let Line = require('models/Line');
let Party = require('models/Party');
let default_image_line = config.get('images:default_image_line');

let router = express.Router();


router.post('/lines/:page?', function (req, res, next) {
	let limit = config.get('project:lines:limit_on_page') || 9;
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
		let id = parseInt(search, 10);
		if (Number.isNaN(Number(id))) {
			id = 0;
		}

		let filter_search = [
			{'line_name_eng': new RegExp(search, "i")},
			{'line_name_eng': new RegExp(search, "i")},
			{'description_ol': new RegExp(search, "i")},
			{'description_eng': new RegExp(search, "i")},
			{'website': new RegExp(search, "i")},
			{'facebook_page': new RegExp(search, "i")},
			{'phone_number': new RegExp(search, "i")},
			{'address.city': new RegExp(search, "i")},
			{'address.country': new RegExp(search, "i")},
			{'music.music_genres': new RegExp(search, "i")}
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
				'address.city': {$in: cities}
			}
		);
	}

	if (filter.length === 0) {
		filter.push({});
	}


	Promise.props({
		lines: Line.paginate({$and: filter}, {page: page, limit: limit})
	}).then(function (lineResults) {

		let lines = Array.from(lineResults.lines.docs);
		let linesIdArray = lines.map((line) => line.id);
		let linesIdHash = [];

		Promise.props({
			parties: Party.find({
				lineId: {$in: linesIdArray},
				date: {$gt: Date.now()}
			}).sort({date: 1}).select('id lineId date')
		}).then(function (partyResults) {

			linesIdArray.forEach((lineId) => {
				let tempCloserDateIndex = partyResults.parties.findIndex((item) => item.lineId === lineId);

				if (tempCloserDateIndex > -1) {
					linesIdHash['id' + lineId] = moment(partyResults.parties[tempCloserDateIndex].date).format('DD/MM/YYYY HH:mm');
				}
			});

			let data = {
				data: lines.map((line) => {
					return Object.assign({nextParty:linesIdHash['id' + line.id] || '-'},line._doc,{image: line.image});
				})
			};

			res.json(data);

		}).catch(function (err) {
			next(err);
		});

	}).catch(function (err) {
		next(err);
	});
});

module.exports = router;