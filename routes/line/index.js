let express = require('express');
let router = express.Router();


let lines_api = require('./api/lines');
let line = require('./line');
let lines = require('./lines');


router.use('/api', lines_api);
router.use(line);
router.use(lines);

module.exports = router;


