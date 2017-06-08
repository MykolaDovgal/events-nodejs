let express = require('express');
let Promise = require('bluebird');
let fs = require('fs');
let config = require('config');
let default_image_line = config.get('images:default_image_line');
let moment = require('moment');

let Party = require('models/Party');
let Bar = require('models/Bar');

let text = {
	'not_selected': config.get('text:not_selected')
};


let router = express.Router();

router.get('/bar/:id', function (request, response, next) {

	Promise.props({
		bar: Bar.findOne({id: request.params.id}).execAsync(),
	})
		.then(function (results) {
			let bar = results.bar;

			if (typeof bar.cover_picture !== 'undefined' && bar.cover_picture.indexOf('http://') === -1 && bar.cover_picture.indexOf('https://') === -1) {
				if (!fs.existsSync('public' + bar.cover_picture)) {
					bar.cover_picture = default_image_line;
				}
			}

			let data = {
				title: results.bar.bar_name_eng,
				showMenu: true,
				bar: bar,
			};

			response.render('pages/bar/singleBar', data);
		})
		.catch(function (err) {
			next(err);
		});
});

module.exports = router;