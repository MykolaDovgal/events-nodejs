let express = require('express');
let fs = require('fs');
let config = require('config');

let router = express.Router();


let setup = require('setup');

let pass = 1488;

router.get('/setup/users/:id', function (req, res, next) {

	let id = +req.params.id;

	if (id === pass) {
		setup.createDummyUser();
		res.send('Users  created.');
	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/userImages/:id', function (req, res, next) {

	let id = +req.params.id;

	if (id === pass) {
		setup.updateUserImages(function () {
			res.send('User images updated.');
		});

	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/parties/:id', function (req, res) {

	let id = +req.params.id;

	if (id === pass) {
		setup.createParty(function () {
			res.send('Parties created.');
		});

	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/events/:id', function (req, res) {

	let id = +req.params.id;

	if (id === pass) {
		setup.createEvent(function () {
			res.send('Events created.');
		});

	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/bars/:id', function (req, res) {

	let id = +req.params.id;

	if (id === pass) {
		setup.createBar(function () {
			res.send('Bars created.');
		});

	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/generateAttendees/:id', function (req, res) {

	let id = +req.params.id;

	if (id === pass) {
		setup.generateAttendees(function () {
			res.send('Setup: generateAttendees.');
		});

	} else {
		res.sendStatus(404);
	}
});


module.exports = router;