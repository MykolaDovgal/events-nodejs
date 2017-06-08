let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let moment = require('moment');
let util = require('util/index');

let config = require('config');
let default_image_user = config.get('images:default_image_user');

let Bar = require('models/Bar');

router.get('/bar/:id/attendees', function (req, res, next) {

    Promise.props({
        bar: Bar.findOne({ id: req.params.id }).execAsync()
    })
        .then(function (results) {
            //let users = results.users;
            let attendees = results.bar.attendees;
            console.log(attendees)
            let data = [];
            let tkt_purchase_count = 0, ticket_checkin_count = 0, total_count = 0;

            attendees.forEach(function (attendee, index) {
                let user = attendee.user;
                if (user !== null) {

                    let username = user.username;
                    let user_pic = user.image_circle;

                    if (attendee.ticket_purchase)
                        tkt_purchase_count += 1;
                    if (attendee.ticket_checkin)
                        ticket_checkin_count += 1;

                    data.push({
                        user_picture: user_pic,
                        userId: attendee.userId,
                        user_name: username,
                        attend_mark_time: attendee.attend_mark_time ? moment(attendee.attend_mark_time).format('DD/MM/YYYY HH:mm') : '',
                        ticket_purchase: attendee.ticket_purchase,
                        ticket_checkin: attendee.ticket_checkin,
                        checkin_time: attendee.checkin_time ? moment(attendee.checkin_time).format('DD/MM/YYYY HH:mm') : '',
                        location_ver: attendee.location_ver,
                        location_ver_time: attendee.location_ver_time ? moment(attendee.location_ver_time).format('DD/MM/YYYY HH:mm') : ''
                    });
                }
            });
            let temp = { ticket_checkin_count: ticket_checkin_count, data: data, tkt_purchase_count: tkt_purchase_count, total_count: total_count };
            res.json(temp);
        })
        .catch(function (err) {
            next(err)
        });
});


module.exports = router;

