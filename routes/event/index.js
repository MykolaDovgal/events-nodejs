let express = require('express');
let router = express.Router();

let events = require('./events');
let getAll = require('./api/getAll');
let eventsApi = require('./api/events');

router.use(events);
router.use(getAll);

module.exports = router;


