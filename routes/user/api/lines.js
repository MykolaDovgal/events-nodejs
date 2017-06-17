let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let Line = require('models/Line');


//return lines where user is manager
router.get('/user/lines/:id?', function (req, res, next) {
	Promise.props({
		lines: Line.find({
			'managers': {$elemMatch: {user_id: {$in: [req.params.id]}}}
		}).execAsync()
	})
		.then(function (results) {
			let lines = [];

			results.lines.forEach(function (line, index) {
				lines.push({
					id: line.id,
					name: line.line_name_eng,
					country: line.address.country || '',
					city: line.address.city || ''
				});
			});

			let data = {
				data: lines
			};
			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});


//delete manager from line
router.post('/line/manager/delete', function (req, res, next) {
	Promise.props({
		line: Line.update({id: req.body.lineId}, {$pull: {managers: {user_id: req.body.userId}}}).execAsync()
	}).then(function (results) {
		res.send(200);
	})
		.catch(function (err) {
			console.log(err);
			next(err);
		});
});


module.exports = router;

