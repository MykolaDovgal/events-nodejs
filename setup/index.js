var mongoose = require('mongoose');

var faker = require('faker');

var config = require('../config');
// mongo connect
var mongo_uri = config.get('db:connection');
var User = require('../models/user');

const COUNT_OF_USERS = 100;
const PASSWORD_USER = '12345';

var setup = {
    createAdmin: function () {
        // create a new user
        var newUser = User({
            id: 0,
            username: config.get('project:admin:username'),
            realname: 'Admin Admin',
            email: config.get('project:admin:email'),
            password: config.get('project:admin:password'),
            profile_picture: '/images/icons/admin.png'
        });

        // save the user
        newUser.save(function (err) {
            if (err) throw err;

            console.log('Admin user created!');
        });
    },
    createDummyUser: function () {

        for (var i = 0; i < COUNT_OF_USERS; i++) {
            // create a new user
            var first_name = faker.name.firstName();
            var last_name = faker.name.lastName();
            var userData = {
                username: faker.internet.userName(first_name, last_name),
                password: PASSWORD_USER,
                firstname: first_name,
                lastname: last_name,
                realname: faker.name.findName(),
                email: faker.internet.email(),
                permission_level: faker.random.number(3),
                about: faker.lorem.sentence(),
                facebook_profile: faker.internet.url(),
                profile_picture: faker.image.avatar(),
                age: 0
            };
            console.log(userData);

            var user = new User(userData);

            // save the user
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
        }
    }
};

module.exports = setup;