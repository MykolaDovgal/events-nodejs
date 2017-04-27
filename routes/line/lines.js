/**
 * Created by Nazarii Beseniuk on 4/21/2017.
 */

var express = require("express");
var Promise = require('bluebird');

var Line = require('models/line');

var linesRoute = express.Router();

linesRoute.route("/lines").get(function(request, response,next){

	Promise.props({
		lines: Line.find().execAsync()
	}).then(function (results) {
			var lines = results.lines;
			var title_page = "Lines List";
			var data = {
				title: title_page,
				showMenu: true,
				lines: JSON.parse(JSON.stringify(lines))
			};

			//console.log(data.lines)

			response.render('pages/lines',data);
		}).catch(function (err) {
			next(err);
		});


});

module.exports = linesRoute;