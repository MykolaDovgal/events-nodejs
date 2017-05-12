var express = require('express');
var Promise = require('bluebird');

var chunks = require('array.chunk');

var Line = require('models/line');

var router = express.Router();

router.get('/parties', function (request, response, next) {
	let data = {
		title: "Parties",
		showMenu: true,
	};

	response.render('pages/party/partiesList', data);
});

module.exports = router;