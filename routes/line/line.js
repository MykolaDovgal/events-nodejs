var express = require('express');
var Promise = require('bluebird');

var Line = require('models/line');

var router = express.Router();

router.get('/line/:id', function (request, response, next) {

	let title_page = "Line Page";
	let data = {
		title: title_page,
		showMenu: true,
	};
	response.render('pages/line', data);
});


module.exports = router;