var express = require('express');
var Promise = require('bluebird');

var Line = require('models/line');

var router = express.Router();

router.get('/line/:id', function (request, response, next) {


	Promise.props({
		line: Line.findOne({id: request.params.id}).execAsync()
	})
		.then(function (results) {
			let data = {
				title: results.line.line_name_eng,
				showMenu: true,
				line : results.line
			};
			response.render('pages/line', data);
		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;