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
        lines: Line.find().execAsync()
    }).then(function (results) {
        var lines = results.lines;
        var title_page = "Lines List";
        var chunk_lines = chunks(lines, 3);
        var data = {
            title: title_page,
            showMenu: true,
            chunk_lines: chunk_lines,
            lines: lines
        };

        //console.log(data.lines)

        response.render('pages/lines', data);
    }).catch(function (err) {
        next(err);
    });


});

module.exports = router;