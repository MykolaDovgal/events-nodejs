/**
 * Created by Nazarii Beseniuk on 4/21/2017.
 */

var express = require('express');
var Promise = require('bluebird');

var chunks = require('array.chunk');

var Line = require('models/line');

var router = express.Router();

router.get('/lines', function (request, response, next) {

    Promise.props({
        lineTotalCount: Line.count().execAsync(),
        lineActiveCount: Line.count({active: true}).execAsync(),
        lineUnActiveCount: Line.count({active: false}).execAsync()
    }).then(function (results) {
        var lines = results.lines;
        var title_page = "Lines List";
        var data = {
            title: title_page,
            showMenu: true,
            lineTotalCount: results.lineTotalCount,
            lineActiveCount: results.lineActiveCount,
            lineUnActiveCount: results.lineUnActiveCount,
        };

        //console.log(data.lines)

        response.render('pages/lines', data);
    }).catch(function (err) {
        next(err);
    });


});

module.exports = router;