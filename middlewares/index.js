/**
 * Created by tegos on 11.04.2017.
 */

let authenticated = require('./authenticated');


let middlewares = {
	'auth': authenticated,
	'all': function (req, res, next) {
		console.warn('Global middleware,  Time:', new Date().toISOString());
		next();
	}
};

module.exports = middlewares;
