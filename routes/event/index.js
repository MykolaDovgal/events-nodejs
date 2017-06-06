let express = require('express');
let router = express.Router();

let events = require('./events');
let event = require('./event');
let getAll = require('./api/getAll');
let update = require('./update');
let pricing = require('./api/pricing');
let attendees = require('./api/attendees');
let general = require('./api/general');

let event_party = require('./api/parties');


router.use(event);
router.use(events);
router.use(getAll);
router.use(update);

router.use('/api', pricing);
router.use('/api', attendees);
router.use('/api', general);
router.use('/api', event_party);

module.exports = router;


