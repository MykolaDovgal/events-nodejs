var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Party = require('models/Party');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.post('/party/add', urlencodedParser, function (request, response, next) {
	let body = request.body;

	let location  = {
		club_name: body['clubName'],
		city: body.locality,
		country: body.country,
		address: body['route'] + ' ' + body['street_number'],
		longitude: {
			lat: body.lat,
			lng: body.lng
			}
	};

	let timeArray = body['party_start_time'].split(' ');

	let newParty = Party({
		title_eng: body['lineOriginName'],
		title_ol: body['lineEnglishName'],
		description_eng: body['englishDescription'],
		description_ol: body['originDescription'],
		date: timeArray[0],
		open_time: timeArray[1],
		location: location
	});

	let data = {
		title: 'Line Page',
		showMenu: true,
	};

	newParty.save()
		.then(function (doc) {
			data.party = doc;
			response.redirect('/party/' + doc.id);
		})
		.catch(function (err) {
			console.log(err);
		});


});

module.exports = router;