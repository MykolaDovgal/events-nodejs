let express = require('express');
let router = express.Router();

let events = require('./events');
let event = require('./event');
let getAll = require('./api/getAll');
let update = require('./update');
let eventsApi = require('./api/events');

router.use(event);
router.use(events);
router.use(getAll);
router.use(update);

module.exports = router;


