let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let Event = require('models/Event');


//return events where user is manager
router.get('/user/events/:id?', function (req, res, next) {
	Promise.props({
		events: Event.find({
			'managers': {$elemMatch: {userId: {$in: [req.params.id]}}}
		}).execAsync()
	})
		.then(function (results) {
			let events = [];

			results.events.forEach(function (event, index) {
				events.push({
					id: event.id,
					name: event.title_eng,
					country: event.location.country || '',
					city: event.location.city || ''
				});
			});

			let data = {
				data: events
			};
			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});


module.exports = router;

