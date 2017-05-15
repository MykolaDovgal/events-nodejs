let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

let Party = require('models/Party');
let Line = require('models/line');

router.get('/parties', function (req, res, next) {

	console.log('asdasdas');
	Promise.props({
		parties: Party.find({}).execAsync()
	})
		.then(function (results) {
			let data = [];

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
					date: party.date,
					open_time: party.open_time,
					attendees_count: 0,
					video_stream_avb: false,
					tkts_avbl_here: false
				});


			});

			console.warn(data);
			let temp = {data: data};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;
