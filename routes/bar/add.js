let express = require('express');
let Bar = require('models/Bar');

let config = require('config');
let default_image_event = config.get('images:default_image_event');

let router = express.Router();


router.post('/bar/add', function (request, response, next) {

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

	let newBar = Bar({
		bar_name_ol: body['barOriginName'],
		bar_name_eng: body['barEnglishName'],
		description_eng: body['englishDescription'],
		description_ol: body['originDescription'],
		location: location,
		cover_picture: default_image_event
	});

	let data = {
		title: 'Line Page',
		showMenu: true,
	};

	newBar.save()
		.then(function (doc) {
			data.party = doc;
			response.redirect('/bar/' + doc.id);
		});


});

module.exports = router;