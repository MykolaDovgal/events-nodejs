let express = require('express');
let router = express.Router();

let parties = require('./parties');
let party_add = require('./add');
let party = require('./party');
let party_update = require('./update');
let party_delete = require('./delete');


router.use(parties);
router.use(party_add);
router.use(party);
router.use(party_update);
router.use(party_delete);


module.exports = router;


