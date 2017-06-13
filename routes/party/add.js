let express = require('express');
let bodyParser = require('body-parser');

let Party = require('models/Party');

let router = express.Router();
let urlencodedParser = bodyParser.urlencoded({extended: false});


router.post('/party/add', urlencodedParser, function (request, response, next) {

	let body = request.body;


	let location = {
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


	let add_current_user_manager = !!+(body['add_current_user_manager']);
	let party_managers = [];
	if (add_current_user_manager) {
		let user = request.user;
		party_managers.push({userId: user.id});
	}


	let newParty = Party({
		title_eng: body['lineEnglishName'],
		title_ol: body['lineOriginName'],
		description_eng: body['englishDescription'],
		description_ol: body['originDescription'],
		date: timeArray[0],
		open_time: timeArray[1],
		location: location,
		lineId: body['lineId'],
		eventId: body['eventId'],
		party_managers
	});


	newParty.save()
		.then(function (doc) {
			response.redirect('/party/' + doc.id);
		})
		.catch(function (err) {
			console.log(err);
		});


});

module.exports = router;