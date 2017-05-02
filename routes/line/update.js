var express = require('express');
var Promise = require('bluebird');

var Line = require('models/line');

var router = express.Router();

router.post('/line/update', function (request, response, next) {

	console.log(request.body);

	response.send(200);
});

module.exports = router;