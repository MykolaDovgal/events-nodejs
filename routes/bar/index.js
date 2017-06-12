let express = require('express');
let router = express.Router();

let bar = require('./bar');
let bars = require('./bars');
let add = require('./add');
let attendees = require('./api/attendees');
let update = require('./update');
let delete_bar = require('./delete');
let general = require('./api/general');
let scroll_bars = require('./api/scrollBars');
let opening_hours = require('./api/openingHours');

router.use(bar);
router.use(delete_bar);
router.use(bars);
router.use(update);
router.use(add);

router.use('/api', scroll_bars);
router.use('/api', attendees);
router.use('/api', general);
router.use('/api', opening_hours);


module.exports = router;


