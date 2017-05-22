var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Line = require('models/line');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.post('/line/add', urlencodedParser, function (request, response, next) {

	let body = request.body;

	let address = {
		city: body.locality,
		country: body.country,
		countryCode: body.country_short,
		latitude: body.lat,
		longitude: body.lng
	};


	let newLine = Line({
		line_name_eng: body['lineEnglishName'],
		line_name_ol: body['lineOriginName'],
		description_eng: body['englishDescription'],
		description_ol: body['originDescription'],
		address: address
	});

	let data = {
		title: 'Line Page',
		showMenu: true,
	};

	newLine.save()
		.then(function (doc) {
			data.line = doc;
			response.redirect('/line/' + doc.id);
		})
		.catch(function (err) {
			console.log(err);
		});


});

module.exports = router;