let express = require('express');
let router = express.Router();

let bar = require('./bar');
let bars = require('./bars');
let update = require('./update')
let general = require('./api/general')
let scroll_bars = require('./api/scrollBars');

router.use(bar);
router.use(bars);
router.use(update)

router.use('/api', scroll_bars);
router.use('/api', general)


module.exports = router;


