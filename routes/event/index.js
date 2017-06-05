let express = require('express');
let router = express.Router();

let events = require('./events');
let event = require('./event');
let getAll = require('./api/getAll');
let update = require('./update');
let pricing = require('./api/pricing');
let attendees = require('./api/attendees');

router.use(event);
router.use(events);
router.use(getAll);
router.use(update);
router.use('/api', pricing);
router.use('/api', attendees);

module.exports = router;


