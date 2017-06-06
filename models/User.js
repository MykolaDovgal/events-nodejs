let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	moment = require('moment'),
	SALT_WORK_FACTOR = 10;

let config = require('config');
let util = require('util/index');

let autoIncrement = require('mongoose-auto-increment');
let default_image_user = config.get('images:default_image_user');

autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	username: {type: String, required: true, index: {unique: true}},
	email: {type: String, index: {unique: true}},
	active: {type: Boolean, default: true},
	password: {type: String, required: true},
	firstname: {
		type: String, trim: true, validate: [
			util.isEmptyValidator
		]
	},
	lastname: {type: String, trim: true},
	realname: {type: String, trim: true},
	permission_level: {type: Number},
	facebook_profile: {type: String, trim: true},
	profile_picture: {type: String, trim: true},
	profile_picture_circle: {type: String, trim: true},
	friends: [{
		userid: {type: Number},
		time_added: {type: Date, default: Date.now}
	}],
	friend_requests: [{
		userid: {type: Number},
		time_added: {type: Date, default: Date.now}
	}],
	about: {type: String},
	date_of_birth: {type: Date},
	date_of_birth_visible: {type: Boolean},
	age: {type: Number},
	phone: {type: String},
	activity: [{
		login_time: {type: Date, default: Date.now},
		logout_time: {type: Date}
	}]
});

UserSchema.pre('save', function (next) {
	let user = this;

	// get the current date
	let currentDate = new Date();

	// change the updated_at field to current date
	user.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!user.created_at)
		user.created_at = currentDate;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.getActivity = function (format = true) {
	return this.activity.map(function (activity) {
		let result;
		if (format)
			result = {
				login_time: '<div class="activity-date">' +
				moment(activity.login_time).format('DD/MM/YYYY') +
				'</div><div class="activity-time">' +
				moment(activity.login_time).format('HH:mm:ss') +
				'</div>',
				logout_time: activity.logout_time ?
					'<div class="activity-date">' +
					moment(activity.login_time).format('DD/MM/YYYY') +
					'</div><div class="activity-time">' +
					moment(activity.login_time).format('HH:mm:ss') +
					'</div>' : '-'
			};
		else
			result = {
				login_time: moment(activity.login_time).format('DD/MM/YYYY HH:mm:ss'),
				logout_time: activity.logout_time ? moment(activity.logout_time).format('DD/MM/YYYY HH:mm:ss') : '-'
			};
		return result;
	});
};

UserSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.password;
		delete ret._id;
		delete ret.__v;
		return ret;
	}
};


UserSchema.statics.setLogInTime = function (userId) {
	this.model('User').findOne({id: userId}, function (err, user) {
		user.activity.push({login_time: new Date()});
		if (user.activity.length > 100)
			user.activity = user.activity.slice(user.activity.length - 100);
		user.save();
	});
};

UserSchema.statics.setLogOutTime = function (userId) {
	this.model('User').findOne({id: userId}, function (err, user) {
		user.activity[user.activity.length - 1].logout_time = new Date();
		user.save();
	});
};

UserSchema.virtual('image_circle').get(function () {
	return util.getImage(this, 'profile_picture_circle', default_image_user);
});


UserSchema.plugin(autoIncrement.plugin, {
	model: 'User',
	field: 'id',
	startAt: 1
});

// validate on update
UserSchema.pre('update', function (next) {
	this.options.runValidators = true;
	next();
});

module.exports = mongoose.model('User', UserSchema);