let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let Bar = require('models/Bar');


router.get('/bar/:id/followers', function (req, res, next) {

	Promise.props({
		bar: Bar.findOne({id: req.params.id}).execAsync()
	})
		.then(function (results) {
			let followers = results.bar.followers;
			let data = [];

			followers.forEach(function (follower, index) {
				let user = follower.user;

				if (user !== null) {

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
			let temp = {data: data};
			res.json(temp);
		})
		.catch(function (err) {
			next(err)
		});
});


module.exports = router;

