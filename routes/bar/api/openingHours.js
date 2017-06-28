let express = require('express');
let Promise = require('bluebird');

let Bar = require('models/Bar');


let router = express.Router();

router.post('/bar/update/:id', function (req, res, next) {

	let body = req.body;
	Promise.props({
		party: Bar.update({id: req.params.id}, {['opening_times.' + body.name]: body['value'],}).execAsync()
	}).then(function (results) {
		res.status(200).send(body['value']);
	})
		.catch(function (err) {
			res.status(500);
			res.send(err.message);
		});

});

router.get('/bar/:id/opening', function (req, res, next) {

	Promise.props({
		times: Bar.findOne({id: req.params.id}).select('opening_times').execAsync()
	})
		.then(function (results) {
			res.json(results.times.opening_times);
		})
		.catch(function (err) {
			next(err)
		});
});



module.exports = router;