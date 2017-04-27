var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/user/delete', function (req, res, next) {

    console.log(req.body);

    User.findOneAndRemove({ id: req.body.userId }, function(err) {
        res.send(200);
        if (err)
            next(err);
    });

});

module.exports = router;
