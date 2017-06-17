let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let Bar = require('models/Bar');


//return bars where user is manager
router.get('/user/bars/:id?', function (req, res, next) {
	Promise.props({
		bars: Bar.find({
			'managers': {$elemMatch: {userId: {$in: [req.params.id]}}}
		}).execAsync()
	})
		.then(function (results) {
			let bars = [];

			results.bars.forEach(function (bar, index) {
				bars.push({
					id: bar.id,
					name: bar.bar_name_eng,
					country: bar.location.country || '',
					city: bar.location.city || ''
				});
			});

			let data = {
				data: bars
			};
			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});


module.exports = router;

