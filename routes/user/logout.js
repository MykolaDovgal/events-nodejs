let express = require('express');
let router = express.Router();
let User = require('models/User');

router.get('/logout', function (req, res) {
	User.setLogOutTime(req.user.id);
	req.session.destroy(function () {
		res.redirect('/');
	});
});

module.exports = router;
