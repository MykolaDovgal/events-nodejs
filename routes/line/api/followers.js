let express = require('express');
let Promise = require('bluebird');
let faker = require('faker');
let moment = require('moment');

let User = require('models/user');

let router = express.Router();


let fs = require('fs');
let config = require('config');
let default_image_user = config.get('images:default_image_user');


// get all lines
router.get('/line/followers', function (req, res, next) {

	Promise.props({
		users: User.find().execAsync()
	})
		.then(function (results) {
			let randomNumber = Math.floor((Math.random() * 50) + 10);

			let users = [];

			for(let i = 0; i< randomNumber;i+=1){

				if (!fs.existsSync('public' + results.users[i].profile_picture_circle) && !results.users[i].profile_picture_circle.includes('http') || results.users[i].profile_picture_circle === '')
					results.users[i].profile_picture_circle = default_image_user;

				users.push({
					profile_picture_circle: results.users[i].profile_picture_circle,
					id:  results.users[i].id,
					username: results.users[i].username,
					time_attended: moment(faker.date.past(5)).format('DD/MM/YYYY HH:mm') ,
					last_attendance: moment(faker.date.past(10)).format('DD/MM/YYYY HH:mm'),
					full_name:  results.users[i].firstname + ' ' + results.users[i].lastname
				});
			}


			res.json({data: users});
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;