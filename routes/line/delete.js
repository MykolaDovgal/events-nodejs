var express = require('express');
var router = express.Router();
var Line = require('../../models/line');



router.post('/line/delete/:id', function (req, res, next) {

	console.log(req.params.id);

	Line.findOneAndRemove({ id: req.params.id }, function(err) {
		res.send(200);
		if (err)
			next(err);
	});
});

module.exports = router;
