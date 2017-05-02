var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Line = require('models/line');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.post('/line/update', function (request, response, next) {

	let body = request.body;
	console.log(body);

	response.send(body);
});

module.exports = router;