let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');

let Party = require('models/Party');
let User = require('models/user');

router.get('/party/:id/attendees', function (req, res, next) {

	Promise.props({
		party: Party.findOne({id: req.params.id}).select('attendees').execAsync()
	})
		.then(function (results) {
			let data = [];

			console.warn(results.party.attendees);

			results.party.attendees.forEach(function (attendee, index) {
				let user_name = '';

				User.findOne({ id: attendee.userId }).select('username')
					.then(function(res){
						user_name = res;
					})
					.catch(function (err){
						user_name = 'test info';
						next(err);
					});


				data.push({
					party_id: party.id,
					line_name_eng: "test data",
					country_name_eng: party.location.country,
					city_name_eng: party.location.city,
					event_name_eng: "test data",
					date: moment(party.date).format('DD/MM/YYYY'),
					open_time: moment( party.open_time).format('HH:mm'),
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

