let express = require('express');
let router = express.Router();

let users = require('./users');
let profile = require('./profile');
let logout = require('./logout');
let login = require('./login');
let user_add = require('./add');
let user_update = require('./update');
let user_delete = require('./delete');
let user_changePicture = require('./changePicture');
let api_activity = require('./api/activity');
let api_lines = require('./api/lines');
let api_events = require('./api/events');
let api_bars = require('./api/bars');
let api_parties = require('./api/parties');


router.use(users);
router.use(logout);
router.use(profile);
router.use(login);
router.use(user_add);
router.use(user_update);
router.use(user_delete);
router.use(user_changePicture);

router.use('/api', api_activity);
router.use('/api', api_lines);
router.use('/api', api_events);
router.use('/api', api_bars);
router.use('/api', api_parties);


module.exports = router;


