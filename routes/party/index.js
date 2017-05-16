let express = require('express');
let router = express.Router();

let parties = require('./parties');
let party_add = require('./add');
let party = require('./party');


router.use(parties);
router.use(party_add);
router.use(party);



module.exports = router;


