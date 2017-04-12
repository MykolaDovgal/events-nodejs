var mongoose = require('mongoose');
var config = require('../config');
// mongo connect
var mongo_uri = config.get('db:connection');
var User = require('../models/user');

var setup = {
    createAdmin: function () {
        // create a new user
        var newUser = User({
            username: config.get('project:admin:username'),
            name: 'Admin Admin',
            email: config.get('project:admin:email'),
            password: config.get('project:admin:password'),
            admin: true
        });

        // save the user
        newUser.save(function (err) {
            if (err) throw err;

            console.log('Admin user created!');
        });
    }
};

module.exports = setup;