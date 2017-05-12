let express = require('express');
let router = express.Router();

let parties = require('./parties');


router.use(parties);






module.exports = router;


