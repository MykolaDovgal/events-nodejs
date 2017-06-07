let express = require('express');
let router = express.Router();

let bars = require('./bars');
let scroll_bars = require('./api/scrollBars');


router.use(bars);

router.use('/api',scroll_bars);



module.exports = router;


