let express = require('express');
let passport = require('passport');

let router = express.Router();
let User = require('models/User');

router.get('/login', function (req, res, next) {
	let address = req.connection.remoteAddress;
	let debug_address = req.app.get('debug_address');

	if (debug_address.includes(address) && req.app.get('debug')) {
		User.findOne({id: 0}).exec(function (err, user) {
			if (user) {
				req.login(user, function (err) {
					if (!err) {
						res.redirect('/');
					}
				});
			}
		});
	} else {
		next();
	}
});

// login
router.get('/login', function (req, res, next) {
	let data = {
		title: 'Login',
		showMenu: false
	};
	res.render('pages/login', data);
});

router.post('/login', function (req, res, next) {

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
