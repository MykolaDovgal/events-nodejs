let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

require('rootpath')();

let Event = require('models/Event');
let Party = require('models/Party');


router.post('/event/delete/:id', function (req, res, next) {
	let eventId = +req.params.id;

	if (eventId > 0) {
		Promise.props({
			party: Party.update({eventId: eventId}, {eventId : -1}).execAsync(),
			event: Event.findOneAndRemove({id: eventId},() => {})
		}).then(function (result) {
			res.sendStatus(200);
		})
			.catch(function (err) {
				next(err);
			});

	} else {
		next();
	}


});

module.exports = router;
