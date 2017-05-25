var express = require('express');
var Promise = require('bluebird');
var fs = require('fs');
var config = require('config');
var default_image_line = config.get('images:default_image_line');
var moment = require('moment');

var Party = require('models/Party');
var Line = require('models/line');


var router = express.Router();

router.get('/party/:id', function (request, response, next) {

	Promise.props({
		party: Party.findOne({id: request.params.id}).execAsync(),
	})
		.then(function (results) {
			let party = results.party;


			if (typeof party.cover_picture !== 'undefined' && party.cover_picture.indexOf('http://') === -1 && party.cover_picture.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + party.cover_picture)) {
					party.cover_picture = default_image_line;
				}
			}

			line = Line.findOne({id: party.lineId}).exec(function (err, line) {

				if (line === null) {
					line = {};
				}

				let data = {
					title: results.party.title_eng,
					showMenu: true,
					party: party,
					party_date: party.date ? moment(party.date).format('DD/MM/YYYY HH:mm') : '',
					line: line
				};

				response.render('pages/party/singleParty', data);
			});


		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;