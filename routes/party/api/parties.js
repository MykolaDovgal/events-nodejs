let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let console = require('better-console');

let Party = require('models/Party');
let Line = require('models/line');
let Event = require('models/Event');

router.all('/parties', function (req, res, next) {
	let date = Date.now();
	let string_from = moment(date).format('YYYY-MM-DD');

	let from = new Date(string_from); // today
	let to = moment(from).add(1, 'd').toDate(); // tomorrow

	let date_filter = req.query.date ? req.query.date : [];
	let addresses = req.query.address;

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
						'date': cond
					}
				);
			}
		});
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

	Promise.props({
		parties: Party.find({$and: filter}, null, {sort: {date: -1}}).execAsync(),
		lines: Line.find().select('id line_name_eng').execAsync(),
		events: Event.find().select('id title_eng').execAsync()
	})
		.then(function (results) {
			let data = [];
			let lines = results.lines;
			let events = results.events;
			let lines_data = {0: ''};
			let events_data = {0: ''};

			lines.forEach(function (line_item) {
				lines_data[line_item.id] = line_item.line_name_eng;
			});

			events.forEach(function (event_item) {
				events_data[event_item.id] = event_item.title_eng;
			});

			results.parties.forEach(function (party) {
				let lineId = (party.lineId === undefined || party.lineId < 0) ? 0 : party.lineId;
				let eventId = (party.eventId === undefined || party.eventId < 0) ? 0 : party.eventId;
				let line_name_eng = lines_data[lineId];
				let event_title = events_data[eventId];

				data.push({
					party_id: party.id,
					line_id: lineId,
					eventId: eventId,
					event_title: event_title,
					line_name_eng: line_name_eng,
					title_eng: party.title_eng,
					country_name_eng: party.location.country,
					city_name_eng: party.location.city,
					date: moment(party.date).format('DD/MM/YYYY'),
					open_time: moment(party.date).format('HH:mm'),
					attendees_count: party.attendees.length,
					video_stream_avb: false,
					tkts_avbl_here: false
				});

			});
			let temp = {data: data};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;
