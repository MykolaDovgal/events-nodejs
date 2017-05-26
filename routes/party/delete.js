var express = require('express');
var router = express.Router();

require('rootpath')();

var Party = require('models/Party');


router.post('/party/delete/:id', function (req, res, next) {
	let party_id = +req.params.id;

	if (party_id > 0) {
		Party.findOneAndRemove({id: party_id}, function (err) {
			res.send(200);
			if (err)
				next(err);
		});
	}else{
		next();
	}
});

module.exports = router;
