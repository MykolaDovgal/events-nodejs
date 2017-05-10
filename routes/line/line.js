var express = require('express');
var Promise = require('bluebird');
var fs = require('fs');
var config = require('config');
var default_image_line = config.get('images:default_image_line');

var Line = require('models/line');

var router = express.Router();

router.get('/line/:id', function (request, response, next) {


	Promise.props({
		line: Line.findOne({id: request.params.id}).execAsync()
	})
		.then(function (results) {
			let line = results.line;
			if (typeof line.cover_picture !== 'undefined' && line.cover_picture.indexOf('http://') === -1 && line.cover_picture.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + line.cover_picture)) {
					line.cover_picture = default_image_line;
				}
			}

			let data = {
				title: results.line.line_name_eng,
				showMenu: true,
				line : line
			};
			response.render('pages/line', data);
		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;