let express = require('express');
let router = express.Router();

let url = require('url');

require('rootpath')();

let middleware = require('middlewares');


let home = require('./home');

let user_index = require('./user/index');

let line_index = require('./line/index');


let event_index = require('./event');


let notification_add = require('./notification/add');
let setup = require('./setup');

let party_index = require('./party/index');


router.all('*', middleware.all);
router.all('*', middleware.auth);

// routes for user
router.use(user_index);

router.use(event_index);

router.use(notification_add);
router.use(setup);

router.use(party_index);
router.use(line_index);


/* GET home page. */
router.get('/', home);


module.exports = router;
