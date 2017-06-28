let express = require('express');
let Promise = require('bluebird');
let moment = require('moment');

let Line = require('models/Line');

let router = express.Router();


router.get('/line/:id/followers', function (req, res, next) {
	let totalNumber = 0;

	Promise.props({
		line: Line.findOne({id: req.params.id}).execAsync()
	})
		.then(function (results) {
			let followers = results.line.followers;
			let data = [];

			followers.forEach(function (follower) {
				let user = follower.user;

				if (user !== null) {
					totalNumber += 1;
					let username = user.username;
					let user_pic = user.image_circle;
					data.push({
						user_picture: user_pic,
						userId: follower.userId,
						user_name: username,
						times_attended: follower.times_attended,
						last_attendence: follower.last_attendence ? moment(follower.last_attendence).format('DD/MM/YYYY HH:mm') : ''
					});
				}
			});
			let temp = {data: data, total_number: totalNumber};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;