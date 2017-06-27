let express = require('express');
let Promise = require('bluebird');
let fs = require('fs');
let config = require('config');
let default_image_line = config.get('images:default_image_line');

let Line = require('models/Line');

let router = express.Router();

router.get('/line/:id', function (request, response, next) {


	Promise.props({
		line: Line.findOne({id: request.params.id}).execAsync()
	})
		.then(function (results) {
			let line = results.line;
			line.cover_picture = line.image;

			let data = {
				title: results.line.line_name_eng,
				showMenu: true,
				line: line
			};
			response.render('pages/line/line', data);
		})
		.catch(function (err) {
			next(err);
		});
});


module.exports = router;