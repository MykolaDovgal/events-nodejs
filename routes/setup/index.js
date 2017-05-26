var express = require('express');
var fs = require('fs');
var config = require('config');

var router = express.Router();


var setup = require('setup');

let pass = 1488;

router.get('/setup/users/:id', function (req, res, next) {

	var id = +req.params.id;

	if (id === pass) {
		setup.createDummyUser();
		res.send('Users  created.');
	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/userImages/:id', function (req, res, next) {

	var id = +req.params.id;

	if (id === pass) {
		setup.updateUserImages(function () {
			res.send('User images updated.');
		});

	} else {
		res.sendStatus(404);
	}
});

router.get('/setup/parties/:id', function (req, res) {

	var id = +req.params.id;

	if (id === pass) {
		setup.createParty(function () {
			res.send('Parties created.');
		});

	} else {
		res.sendStatus(404);
	}
});


module.exports = router;