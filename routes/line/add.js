var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Line = require('models/line');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.post('/line/add',urlencodedParser, function (request, response, next) {

	let body = request.body;
	let newLine = Line({
		line_name_eng: body['lineOriginName'],
		line_name_ol: body['lineEnglishName'],
		description_eng:body['englishDescription'],
		description_ol: body['originDescription'],
		country:body['countrySelect'],
		city:body['citySelect'],

	});

	let data = {
		title: 'Line Page',
		showMenu: true,
	};
	newLine.save()
		.then(function(doc){
			console.log("Сохранен объект", doc.id);
			data.line = doc;
			console.log(data);
			response.render('pages/line', data);
		})
		.catch(function (err){
			console.log(err);
		});


});

module.exports = router;