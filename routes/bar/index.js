let express = require('express');
let router = express.Router();

let bar = require('./bar');
let bars = require('./bars');
let update = require('./update')
let general = require('./api/general')
let attendees = require('./api/attendees')
let scroll_bars = require('./api/scrollBars');

router.use(bar);
router.use(bars);
router.use(update)

router.use('/api', scroll_bars);
router.use('/api', general)
router.use('/api', attendees)

module.exports = router;


