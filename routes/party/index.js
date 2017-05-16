let express = require('express');
let router = express.Router();

let parties = require('./parties');
let party_add = require('./add');


router.use(parties);
router.use(party_add);



module.exports = router;


