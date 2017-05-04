var express = require('express');
var Promise = require('bluebird');
var bodyParser = require("body-parser");

var Line = require('models/line');

var router = express.Router();
var multer = require('multer');
var upload = multer();


router.post('/line/update/:id', upload.any(), function (request, response, next) {

	let body = request.body;
	let val ;
		if(body['value'])
			val = body['value'];
		else
			val = body['value[]'];

	Promise.props({
		line: Line.update({id: request.params.id}, { [body.name] : val,} ).execAsync()
	}).then(function (results) {
		console.log(body);
		console.log(body.name);
		console.log(body['value']);
		response.send(200);
	})
		.catch(function (err) {
			next(err);
		});
});

module.exports = router;