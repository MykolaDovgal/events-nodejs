let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

let Party = require('models/Party');

let config = require('config');
let fs = require('fs');
let default_image_line = config.get('images:default_image_line');


router.get('/parties/typeahead', function (req, res, next) {

	Promise.props({
		parties: Party.find({}).execAsync()
	})
		.then(function (results) {
			let data = [];

			results.parties.forEach(function (party, index) {

				if (party.cover_picture === undefined || !fs.existsSync('public' + party.cover_picture) && !party.cover_picture.includes('http') || party.cover_picture === '')
					party.cover_picture = default_image_line;

				data.push({
					id: party.id,
					title_ol: party.title_ol,
					title_eng: party.title_eng,
					date: party.date,
					picture: party.cover_picture
				});
			});

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;