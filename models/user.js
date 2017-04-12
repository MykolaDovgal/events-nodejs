var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    name: {type: String}
});

UserSchema.pre('save', function (next) {
    var user = this;

    // get the current date
    var currentDate = new Date();

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

UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('User', UserSchema);