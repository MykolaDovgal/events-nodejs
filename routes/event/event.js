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


			let data = {
				cover_picture: event.image,
				title: results.event.title_eng,
				showMenu: true,
				event: event,
				start_date: event.start_date ? moment(event.start_date).format('DD/MM/YYYY') : '',
				end_date: event.end_date ? moment(event.end_date).format('DD/MM/YYYY') : ''
			};


			response.render('pages/event/singleEvent', data);


		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;