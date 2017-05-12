var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var faker = require('faker');
var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');

require('rootpath')();

var config = require('config');
// mongo connect
var mongo_uri = config.get('db:connection');
var User = require('models/user');
var Line = require('models/line');

//var UserSchema = require('mongoose').model('Song').schema;
var UserSchema = User.schema;
var LineSchema = Line.schema;

const COUNT_OF_USERS = 100;
const COUNT_OF_LINES = 50;
const PASSWORD_USER = '12345';

var setup;
setup = {


	createAdmin: function () {
		// create a new user
		var newUser = User({
			id: 0,
			username: config.get('project:admin:username'),
			realname: 'Admin Admin',
			email: config.get('project:admin:email'),
			password: config.get('project:admin:password'),
			profile_picture: '/images/icons/admin.png',
			profile_picture_circle: '/images/icons/admin.png',
			permission_level: 5
		});

		// save the user
		newUser.save(function (err) {
			if (err) throw err;

			console.log('Admin user created!');
		});
	},
	createDummyUser: function () {

		UserSchema.plugin(autoIncrement.plugin, {
			model: 'User',
			field: 'id',
			startAt: 1
		});


		for (var i = 0; i < COUNT_OF_USERS; i++) {
			// create a new user
			var first_name = faker.name.firstName();
			var last_name = faker.name.lastName();
			var remote_url = faker.image.avatar();

			var local_image = './public/uploads/users/' + first_name + '.png';
			var local_image_save = '/uploads/users/' + first_name + '.png';

			downloadImage(remote_url, local_image, function () {
				console.log(local_image_save);
			});

			var userData = {
				username: faker.internet.userName(first_name, last_name),
				password: PASSWORD_USER,
				firstname: first_name,
				lastname: last_name,
				realname: faker.name.findName(),
				email: faker.internet.email(),
				permission_level: faker.random.number(4),
				about: faker.lorem.sentence(),
				facebook_profile: faker.internet.url(),
				profile_picture: local_image_save,
				profile_picture_circle: local_image_save,
				age: faker.random.number(10, 90),
				active: faker.random.boolean(),
				date_of_birth: faker.date.past()
			};
			console.log(userData);

			var user = new User(userData);

			// save the user
			user.save(function (err) {
				if (err) {
					console.log(err);
					throw err;
				}
			});
		}
	},

	// download user images
	updateUserImages: function (cb) {
		let count = 0;
		Promise.props({
			users: User.find({})
		}).then(function (results) {
			let users = results.users;

			users.forEach(function (user) {
				let first_name = user.firstname;
				let local_image = './public/uploads/users/' + first_name + '.png';
				let remote_image = faker.internet.avatar();
				if (!fs.existsSync(local_image) && first_name) {
					downloadImage(remote_image, local_image, function () {
						//console.log(local_image);
					});
					count++;
				}

			});

			if (cb) {
				cb();
			}
			console.warn('Updated ' + count + ' images');

		}).catch(function (err) {
			console.warn(err);
		});

	},

	createLines: function () {

		LineSchema.plugin(autoIncrement.plugin, {
			model: 'Line',
			field: 'id',
			startAt: 1
		});

		for (var i = 0; i < COUNT_OF_LINES; i += 1) {
			var manag = [];
			var mus = [];
			var count = faker.random.number(2, 10);
			for (var j = 0; j < count; j += 1) {
				manag.push({userid: j});
				mus.push(faker.lorem.word());
			}

			var line_name = faker.name.title();
			var color = faker.random.arrayElement(['FFFF00', 'CC0000', '663366', 'FF3366', '0099FF', '00FF66', 'FFFF99']);
			//var cover_picture = 'http://dummyimage.com/415x240/' + color + '/000.png';
			var cover_picture = 'https://placeimg.com/450/240/arch?' + line_name;
			//http://dummyimage.com/415x240/000/ffffff.png

			var lineData = {
				active: faker.random.boolean(),
				line_name_eng: line_name + '(eng)',
				line_name_ol: line_name + '(ol)',
				description_eng: faker.lorem.lines() + '(eng)',
				description_ol: faker.lorem.lines() + '(ol)',
				country: faker.address.country(),
				city: faker.address.city(),
				facebook_page: faker.internet.url(),
				website: faker.internet.url(),
				phone_number: faker.phone.phoneNumber(),
				cover_picture: cover_picture,
				managers: manag,
				music: {
					music_genres: mus,
					music_sample: faker.lorem.word()
				}
			};

			var line = new Line(lineData);

			line.save(function (err) {
				if (err) {
					console.log(err);
					throw err;
				}
			});
		}

	}
};

var downloadImage = function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

module.exports = setup;