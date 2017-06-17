let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let util = require('util/index');

let Party = require('models/Party');


//return parties where user is manager
router.get('/user/parties/:id?', function (req, res, next) {
	Promise.props({
		parties: Party.find({
			'party_managers': {$elemMatch: {userId: {$in: [req.params.id]}}}
		}).execAsync()
	})
		.then(function (results) {
			let parties = [];

			results.parties.forEach(function (party, index) {
				parties.push({
					id: party.id,
					name: party.title_eng,
					country: party.location.country || '',
					city: party.location.city || ''
				});
			});

			let data = {
				data: parties
			};
			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});


module.exports = router;

