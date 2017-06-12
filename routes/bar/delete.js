let express = require('express');
let router = express.Router();
require('rootpath')();

let Bar = require('models/Bar');


router.post('/bar/delete/:id', function (req, res, next) {
	let barId = +req.params.id;
	console.warn('asdasdqeqweasasdasdasdqeqweasdaDAASDASDADASDASDsasdqeqweasdaDAASDASDADASDASDsdaDAASDASDADASDASDs');
	barId > 0 ? Bar.findOneAndRemove({id: barId}, err => err ? next(err) : res.sendStatus(200)) : next();
});

module.exports = router;
