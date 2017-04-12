var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');

var setup = require('./setup');

// mongo connect
var mongo_uri = config.get('db:connection');
console.log(mongo_uri);
mongoose.Promise = Promise;
mongoose.connect(mongo_uri);


var User = require('./models/user');
// add admin
User.count({}, function (err, count) {
    if (count === 0) {
        setup.createAdmin();
    }
});

// routes
var routes = require('./routes');
var api_routes = require('./routes/api');

var app = express();

// Passport:

app.use(require('express-session')({secret: 'secret', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// auth
var userModel = User;


passport.serializeUser(function (user, done) {
    //console.log(user);
    done(null, user);
});

passport.deserializeUser(function (user_data, done) {
    console.log('des');
    console.log(user_data);
    done(null, user_data);
    // userModel.findOne({email: user_data.email}, function (err, user) {
    // 	done(err, user);
    // });
});


passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // with req
    },
    function (req, username, password, done) {
        //console.log('username');
        //console.log(email);

        process.nextTick(function () {

            userModel.findOne({username: username}).exec(function (err, user) {
                if (user) {

                    console.log(user);
                    console.log(password);

                    user.comparePassword(password, function (err, isMatch) {
                        // check if the password was a match
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    });

                } else {
                    return done(null, false);
                }
            });

        });
    }
));

app.use(routes);
app.use('/api', api_routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
