let express = require('express');
let router = express.Router();

require('rootpath')();

let Event = require('models/Event');


router.post('/event/delete/:id', function (req, res, next) {
	let eventId = +req.params.id;

	if (eventId > 0) {
		Event.findOneAndRemove({id: eventId}, err => err ? next(err) : res.send(200));
	}else{
		next();
	}
});

module.exports = router;
