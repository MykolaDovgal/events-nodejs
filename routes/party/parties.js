let express = require('express');
let Promise = require('bluebird');


let Party = require('models/Party');

let router = express.Router();

router.get('/parties', function (request, response, next) {
	let data = {
		title: "Parties",
		showMenu: true,
	};

	response.render('pages/party/partiesList', data);
});

module.exports = router;