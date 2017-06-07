let express = require('express');
let router = express.Router();

let bars = require('./bars');



router.use(bars);



module.exports = router;


