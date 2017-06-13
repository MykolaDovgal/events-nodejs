let express = require('express');
let Promise = require('bluebird');
let faker = require('faker');
let moment = require('moment');

let User = require('models/User');

let router = express.Router();


let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');


// get all lines
router.get('/line/followers', function (req, res, next) {
	let randomNumber = Math.floor((Math.random() * 50) + 10);
	Promise.props({
		users: User.find().limit(randomNumber).execAsync()
	})
		.then(function (results) {

			let users = [];

			for (let i = 0; i < randomNumber; i += 1) {

				users.push({
					profile_picture_circle: results.users[i].image,
					id: results.users[i].id,
					username: results.users[i].username,
					time_attended: moment(faker.date.past(5)).format('DD/MM/YYYY HH:mm'),
					last_attendance: moment(faker.date.past(10)).format('DD/MM/YYYY HH:mm'),
					full_name: results.users[i].firstname + ' ' + results.users[i].lastname
				});
			}

			res.json({data: users, total_number: randomNumber});
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;