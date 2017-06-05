let express = require('express');
let router = express.Router();

let events = require('./events');
let event = require('./event');
let getAll = require('./api/getAll');
let update = require('./update');
let pricing = require('./api/pricing');


router.use(event);
router.use(events);
router.use(getAll);
router.use(update);
router.use('/api', pricing);

module.exports = router;


