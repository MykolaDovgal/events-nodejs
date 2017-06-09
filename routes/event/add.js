let express = require('express');
let Event = require('models/Event');
let config = require('config');
let default_image_event = config.get('images:default_image_event');

let router = express.Router();


router.post('/event/add', function (request, response, next) {

	let body = request.body;

	let location = {
		city: body.locality,
		country: body.country,
		address: body['route'] + ' ' + body['street_number'],
		longitude: {
			lat: body.lat,
			lng: body.lng
		}
	};

	let newEvent = Event({
		title_ol: body['eventEnglishName'],
		title_eng: body['eventOriginName'],
		description_eng: body['englishDescription'],
		description_ol: body['originDescription'],
		start_date: body['event_start_time'],
		end_date: body['event_end_time'],
		location: location,
		//cover_picture: default_image_event
	});

	let data = {
		title: 'Line Page',
		showMenu: true,
	};

	newEvent.save()
		.then(function (doc) {
			data.party = doc;
			response.redirect('/event/' + doc.id);
		});


});

module.exports = router;