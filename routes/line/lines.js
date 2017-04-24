/**
 * Created by Nazarii Beseniuk on 4/21/2017.
 */

var express = require("express");

var linesRoute = express.Router();

linesRoute.route("/lines").get(function(request, response,next){
	var data = {
		title: 'Lines',
		showMenu: true
	};
	response.render('pages/lines',data);
});

module.exports = linesRoute;