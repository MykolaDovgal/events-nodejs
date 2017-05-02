var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Line = require('models/line');

var router = express.Router();
var multer = require('multer');
var upload = multer();


router.post('/line/update', upload.any(), function (request, response, next) {

	let body = request.body;
	console.log(body);

	response.send(body);
});

module.exports = router;