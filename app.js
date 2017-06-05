let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let mongoose = require('mongoose');
let Promise = require('bluebird');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let config = require('./config');

let setup = require('./setup');

// mongo connect
let mongo_uri = config.get('db:connection');
//console.log(mongo_uri);
mongoose.Promise = Promise;
mongoose.connect(mongo_uri);

Promise.promisifyAll(mongoose);


let User = require('./models/User');

// add admin
User.count({username: config.get('project:admin:username')}, function (err, count) {
	if (count === 0) {
		setup.createAdmin();
	}
});


// routes
let routes = require('./routes');
let api_routes = require('./routes/api');

let app = express();

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

//setup.createParty();
// setup.createEvent();


// auth
let userModel = User;


passport.serializeUser(function (user, done) {
	//console.log(user);
	done(null, user);
});

passport.deserializeUser(function (user_data, done) {
	done(null, user_data);
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
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (err.status !== 404) {
		console.warn(err);
	}


	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

console.warn('App Started');

app.set('absolute_view', __dirname + '/views');
app.set('absolute_path', __dirname);
app.set('debug', true);
app.set('debug_address', ['127.0.0.1', '::ffff:127.0.0.1', '::1']);


module.exports = app;
