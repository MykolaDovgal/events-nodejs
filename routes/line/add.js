var express = require('express');
var Promise = require('bluebird');

var Line = require('models/line');

var router = express.Router();


router.post('/line/add', function (request, response, next) {

	var form = $('#form_add_line');

	let lineDate = {

	};

	line.save().then(function (err,results) {
		let title_page = 'Line Page';
		let data = {
			title: title_page,
			showMenu: true,
		};
		response.render('pages/line', data);
	})
		.catch(function (err) {
			next(err);
		});
});



module.exports = router;