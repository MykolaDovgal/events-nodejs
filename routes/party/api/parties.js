let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');
let Line = require('models/line');

router.all('/parties', function (req, res, next) {

	let search = req.query.search ? req.query.search : {};
	let addresses = req.query.address;

	let cities = [];

	if (addresses && addresses.length > 0) {
		cities = addresses.map((address) => {
			return JSON.parse(address).city;
		});
	}

	let filter = [];

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

	console.log(filter);


	Promise.props({
		parties: Party.find({$and: filter}).execAsync()
	})
		.then(function (results) {
			let data = [];

			console.log(results);

			results.parties.forEach(function (party, index) {
				let line_name_eng;

				Line.findOne({
					'id': party.lineId
				}).select('line_name_eng')
					.exec(function (err,res) {
						line_name_eng = res;
					});

				data.push({
					party_id: party.id,
					line_name_eng: "test data",
					country_name_eng: party.location.country,
					city_name_eng: party.location.city,
					event_name_eng: "test data",
					date: moment(party.date).format('DD/MM/YYYY'),
					open_time: moment(party.open_time).format('HH:mm'),
					attendees_count: 0,
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
