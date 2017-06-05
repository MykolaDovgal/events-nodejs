let express = require('express');
let router = express.Router();
let passport = require('passport');
let url = require('url');

require('rootpath')();

let util = require('util');
//let Promise = require('bluebird');

let User = require('models/User');


let middleware = require('middlewares');


let home = require('./home');
let users = require('./users');

let profile = require('./user/profile');
let logout = require('./logout');


let line_index = require('./line/index');

let line_add = require('./line/add');
let line_update = require('./line/update');
let line_delete = require('./line/delete');

let events = require('./event');

let user_add = require('./user/add');
let user_update = require('./user/update');
let user_delete = require('./user/delete');
let user_changePicture = require('./user/changePicture');

let notification_add = require('./notification/add');
let setup = require('./setup');

let party_index = require('./party/index');
let api_lines = require('./line/api/index');


router.all('*', middleware.all);
router.all('*', middleware.auth);

router.use(logout);
router.use(user_add);
router.use(user_update);
router.use(user_delete);
router.use(user_changePicture);


router.use(line_add);
router.use(line_update);
router.use(line_delete);

router.use(events);

router.use(notification_add);
router.use(setup);

router.use(party_index);
router.use(api_lines);
router.use(line_index);

router.get('/login', function (req, res, next) {
	let address = req.connection.remoteAddress;
	let debug_address = req.app.get('debug_address');

	if (debug_address.includes(address)) {
		User.findOne({id: 0}).exec(function (err, user) {
			if (req.app.get('debug')) {
				if (user) {
					req.login(user, function (err) {
						if (!err) {
							res.redirect('/');
						}
					});
				}
			}
		});
	} else {
		next();
	}
});

/* GET home page. */
router.get('/', home);

/* page users . */
router.get('/users', users);
router.all('/users/:id?', profile);


// login
router.get('/login', function (req, res, next) {
	let data = {
		title: 'Login',
		showMenu: false
	};
	res.render('pages/login', data);
});

router.post('/login', function (req, res, next) {
	console.warn('trying to login');

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err)
		}
		if (!user) {
			console.log(info);
			return res.redirect('/login')
		}
		// user ok
		req.logIn(user, function (err) {
			console.log(info);
			console.error(user);
			// save login time
			User.setLogInTime(user.id);
			if (err) {
				return next(err);
			}
			return res.redirect('/');
		});
	})(req, res, next);


});


module.exports = router;
