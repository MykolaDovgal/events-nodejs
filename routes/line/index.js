let express = require('express');
let router = express.Router();


let lines_api = require('./api/lines');
let getAllLines = require('./api/getAllLines');
let line = require('./line');
let lines = require('./lines');

let line_add = require('./add');
let line_update = require('./update');
let line_delete = require('./delete');


router.use('/api', lines_api);
router.use('/api', getAllLines);
router.use(line);
router.use(lines);

router.use(line_add);
router.use(line_update);
router.use(line_delete);

module.exports = router;


