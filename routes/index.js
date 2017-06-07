let express = require('express');
let router = express.Router();

let url = require('url');

require('rootpath')();

let middleware = require('middlewares');


let home = require('./home');

let user_index = require('./user/index');
let line_index = require('./line/index');
let event_index = require('./event');
let party_index = require('./party/index');
let bar_index = require('./bar/index');


let notification_add = require('./notification/add');
let setup = require('./setup');




router.all('*', middleware.all);
router.all('*', middleware.auth);

router.use(setup);

router.use(user_index);
router.use(event_index);
router.use(party_index);
router.use(line_index);
router.use(bar_index);

router.use(notification_add);




/* GET home page. */
router.get('/', home);


module.exports = router;
