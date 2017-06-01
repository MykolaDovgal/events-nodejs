let express = require('express');
let Promise = require('bluebird');
let fs = require('fs');
let config = require('config');
let default_image_line = config.get('images:default_image_line');
let moment = require('moment');


let Party = require('models/Party');
let Event = require('models/Event');

let text = {
	'not_selected': config.get('text:not_selected')
};


let router = express.Router();

router.get('/event/:id', function (request, response, next) {

	Promise.props({
		event: Event.findOne({id: request.params.id}).execAsync(),
	})
		.then(function (results) {
			let event = results.event;


			if (typeof event.cover_picture !== 'undefined' && event.cover_picture.indexOf('http://') === -1 && event.cover_picture.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + event.cover_picture)) {
					event.cover_picture = default_image_line;
				}
			}

			Promise.props({
				party: Party.findOne({id: event.partyId}).execAsync(),
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
						title: results.event.title_eng,
						showMenu: true,
						event: event,
						start_date: event.start_date ? moment(event.start_date).format('DD/MM/YYYY HH:mm') : '',
						end_date: event.end_date ? moment(event.end_date).format('DD/MM/YYYY HH:mm') : '',
						line: results_le.line
					};

					console.warn(data);


					response.render('pages/event/singleEvent', data);
				});


		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;