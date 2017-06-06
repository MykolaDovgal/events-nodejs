let express = require('express');
let router = express.Router();

let users = require('./users');
let profile = require('./profile');
let logout = require('./logout');
let login = require('./login');
let user_add = require('./add');
let user_update = require('./update');
let user_delete = require('./delete');
let user_changePicture = require('./changePicture');


router.use(users);
router.use(logout);
router.use(profile);
router.use(login);
router.use(user_add);
router.use(user_update);
router.use(user_delete);
router.use(user_changePicture);


module.exports = router;


