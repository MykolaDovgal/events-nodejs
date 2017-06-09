let express = require('express');
let Promise = require('bluebird');
let faker = require('faker');
let moment = require('moment');

let Party = require('models/Party');

let router = express.Router();


router.get('/line/:id/parties', function (req, res, next) {

	Promise.props({
		party: Party.find({lineId: req.params.id}).execAsync()
	})
		.then(function (results) {
			let parties = [];
			results.party.forEach((party) => {
				parties.push({
					id: party.id,
					title: party.title_eng,
					club: party.location.club_name,
					date: party.date ? moment(party.date).format('DD/MM/YYYY') : '',
					open_time: party.date ? moment(party.date).format('HH:mm') : '',
					attendees_count: party.attendees.length,
					video_stream_avbl: party.video_stream_avbl,
					tkts_avbl_here: party.tkts_avbl_here
				})
			});
			res.json({data: parties});
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;