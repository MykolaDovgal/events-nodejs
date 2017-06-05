let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');

let faker = require('faker');
let fs = require('fs');
let request = require('request');
let Promise = require('bluebird');
let path = require('path');


require('rootpath')();


let config = require('config');
// mongo connect
let mongo_uri = config.get('db:connection');
let User = require('models/user');
let Line = require('models/line');
let Party = require('models/Party');
let Event = require('models/Event');

//let UserSchema = require('mongoose').model('Song').schema;
let UserSchema = User.schema;
let LineSchema = Line.schema;
let PartySchema = Party.schema;
let EventSchema = Event.schema;

const COUNT_OF_USERS = 100;
const COUNT_OF_LINES = 50;
const COUNT_OF_PARTY = 50;
const COUNT_OF_EVENTS = 50;
const PASSWORD_USER = '12345';

let setup;

setup = {
	createAdmin: function () {
		// create a new user
		let newUser = User({
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


		for (let i = 0; i < COUNT_OF_USERS; i++) {
			// create a new user
			let first_name = faker.name.firstName();
			let last_name = faker.name.lastName();
			let remote_url = faker.image.avatar();

			let local_image = './public/uploads/users/' + first_name + '.png';
			let local_image_save = '/uploads/users/' + first_name + '.png';

			downloadImage(remote_url, local_image, function () {
				console.log(local_image_save);
			});

			let userData = {
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

			let user = new User(userData);

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

		for (let i = 0; i < COUNT_OF_LINES; i += 1) {
			let manag = [];
			let mus = [];
			let count = faker.random.number(2, 10);
			for (let j = 0; j < count; j += 1) {
				manag.push({userid: j});
				mus.push(faker.lorem.word());
			}

			let line_name = faker.name.title();
			let color = faker.random.arrayElement(['FFFF00', 'CC0000', '663366', 'FF3366', '0099FF', '00FF66', 'FFFF99']);
			//let cover_picture = 'http://dummyimage.com/415x240/' + color + '/000.png';
			let cover_picture = 'https://placeimg.com/450/240/arch?' + line_name;
			//http://dummyimage.com/415x240/000/ffffff.png

			let lineData = {
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

			let line = new Line(lineData);

			line.save(function (err) {
				if (err) {
					console.log(err);
					throw err;
				}
			});
		}

	},

	createParty: function (cb) {

		Promise.props({
			users: User.find().lean().distinct('id'),
			lines: Line.find().lean().distinct('id')
		}).then(function (results) {
			let users = results.users;
			let lines = results.lines;
			let random_users = setup.getRandomElements(users, 20);

			console.log(random_users);


			for (let i = 0; i < COUNT_OF_PARTY; i += 1) {

				let attendees = [];

				for (let j = 0; j < faker.random.number({min: 0, max: 30}); j += 1) {
					attendees.push({
						userId: faker.random.arrayElement(users),
						ticket_purchase: faker.random.boolean(),
						ticket_checkin: faker.random.boolean(),
						checkin_time: faker.date.past(10),
						attend_mark_time: faker.date.past(10),
						here_mark_time: faker.date.past(1),
						location_ver: faker.random.boolean(),
						location_ver_time: faker.date.past(5)
					});
				}

				let party_name = faker.name.title();
				let cover_picture = 'https://placeimg.com/450/240/arch?' + party_name;

				let partyData = {
					lineId: faker.random.arrayElement(lines),
					title_eng: party_name + ' (eng)',
					title_ol: faker.name.title() + ' (ol)',
					eventId: undefined,
					description_eng: faker.lorem.lines() + '(eng)',
					description_ol: faker.lorem.lines() + '(ol)',
					cover_picture: cover_picture,
					date: faker.date.between('2016-01-01', '2017-12-31'),
					location: {
						club_name: faker.company.companyName(),
						country: faker.address.country(),
						city: faker.address.city(),
						address: faker.address.streetName(),
						longitude: {
							lat: faker.address.latitude(),
							lng: faker.address.longitude()
						}
					},
					// bar: [{drinkCategories: []}],
					tkts_avbl_here: faker.random.boolean(),
					tkt_price: [],
					attendees: attendees
				};

				let party = new Party(partyData);

				party.save(function (err) {
					if (err) {
						console.log(err);
						throw err;
					}
				});
			}
			if (cb) {
				cb();
			}
		});

	},

	createEvent: function (cb) {

		Promise.props({
			users: User.find().lean().distinct('id')
		}).then(function (results) {
			let users = results.users;
			let random_users = setup.getRandomElements(users, 20);

			for (let i = 0; i < COUNT_OF_EVENTS; i += 1) {

				let attendees = [];

				for (let j = 0; j < faker.random.number({min: 0, max: 30}); j += 1) {
					attendees.push({
						userId: faker.random.arrayElement(users),
						ticket_purchase: faker.random.boolean(),
						ticket_checkin: faker.random.boolean(),
						checkin_time: faker.date.past(10),
						attend_mark_time: faker.date.past(10),
						here_mark_time: faker.date.past(1),
						location_ver: faker.random.boolean(),
						location_ver_time: faker.date.past(5)
					});
				}

				let event_name = faker.name.title();
				let cover_picture = 'https://placeimg.com/450/240/arch?' + event_name;

				let eventData = {
					title_eng: event_name + ' (eng)',
					title_ol: faker.name.title() + ' (ol)',
					eventId: undefined,
					description_eng: faker.lorem.lines() + '(eng)',
					description_ol: faker.lorem.lines() + '(ol)',
					cover_picture: cover_picture,
					start_date: faker.date.between('2016-01-01', '2017-12-31'),
					end_date: faker.date.between('2016-01-01', '2017-12-31'),
					location: {
						country: faker.address.country(),
						city: faker.address.city(),
						address: faker.address.streetName(),
						longitude: {
							lat: faker.address.latitude(),
							lng: faker.address.longitude()
						}
					},
					tkts_avbl_here: faker.random.boolean(),
					tkt_price: [],
					attendees: attendees
				};

				let event = new Event(eventData);

				event.save(function (err) {
					if (err) {
						console.log(err);
						throw err;
					}
				});
			}
			if (cb) {
				cb();
			}
		});

	},

	createDirectories: function (cb) {
		let app_path = path.join(__dirname, '../');

		console.warn(app_path);

		let dirs = [
			app_path + 'public/uploads/events/',
			app_path + 'public/uploads/parties/',
			app_path + 'public/uploads/lines/',
			app_path + 'public/uploads/users/',
		];

		dirs.forEach(function (dir) {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
		});

		if (cb) {
			cb();
		}
	},

	generateAttendees: function (cb) {
		Promise.props({
			users: User.find().lean().distinct('id'),
			events: Event.find()
		}).then(function (results) {
			let users = results.users;
			let events = results.events;

			if (events !== null) {
				events.forEach(function (event) {

					let attendees = [];

					for (let j = 0; j < faker.random.number({min: 5, max: 30}); j += 1) {
						attendees.push({
							userId: faker.random.arrayElement(users),
							ticket_purchase: faker.random.boolean(),
							ticket_checkin: faker.random.boolean(),
							checkin_time: faker.date.past(10),
							attend_mark_time: faker.date.past(10),
							here_mark_time: faker.date.past(1),
							location_ver: faker.random.boolean(),
							location_ver_time: faker.date.past(5)
						});
					}

					console.log(attendees);

					event.attendees = attendees;
					event.save();
				});
			}

			if (cb) {
				cb();
			}

		});
	},

	getRandomElements: function (array, count = 1) {
		let result = array;
		if (count < array.length) {
			array.sort(function () {
				return 0.5 - Math.random()
			});
			result = array.slice(0, count);
		}
		return result;
	}


};

let downloadImage = function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

module.exports = setup;