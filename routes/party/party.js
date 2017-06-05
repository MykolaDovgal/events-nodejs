let express = require('express');
let Promise = require('bluebird');
let fs = require('fs');
let config = require('config');
let default_image_line = config.get('images:default_image_line');
let moment = require('moment');

let Party = require('models/Party');
let Line = require('models/Line');
let Event = require('models/Event');

let text = {
	'not_selected': config.get('text:not_selected'),
	'empty': config.get('text:not_selected')
};


let router = express.Router();

router.get('/party/:id', function (request, response, next) {

	Promise.props({
		party: Party.findOne({ id: request.params.id }).execAsync(),
	})
		.then(function (results) {
			let party = results.party;


			if (typeof party.cover_picture !== 'undefined' && party.cover_picture.indexOf('http://') === -1 && party.cover_picture.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + party.cover_picture)) {
					party.cover_picture = default_image_line;
				}
			}

			Promise.props({
				line: Line.findOne({ id: party.lineId }).execAsync(),
				event: Event.findOne({ id: party.eventId }).execAsync(),
			})
				.then(function (results_le) {
					if (results_le.line === null) {
						results_le.line = {
							line_name_eng: text.not_selected,
							line_name_ol: text.not_selected
						};
					}
					if (results_le.event === null) {
						results_le.event = {
							title_ol: text.not_selected,
							title_eng: text.not_selected,
						};
					}

					let data = {
						title: results.party.title_eng,
						showMenu: true,
						party: party,
						party_date: party.date ? moment(party.date).format('DD/MM/YYYY HH:mm') : '',
						line: results_le.line,
						event: results_le.event
					};

					response.render('pages/party/singleParty', data);
				});


		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;