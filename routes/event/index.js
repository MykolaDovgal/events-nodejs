let express = require('express');
let router = express.Router();

let events = require('./events');
let eventsApi = require('./api/events');

router.use(events);

module.exports = router;


