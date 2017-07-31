let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');
let moment = require('moment');

let config = require('config');
let util = require('util/index');
let default_image_event = config.get('images:default_image_line');

autoIncrement.initialize(mongoose.connection);

let EventSchema = new Schema({
		id: {type: Number, required: true, index: {unique: true}},
		title_ol: {
			type: String, required: true, trim: true, validate: [
				util.isEmptyValidator
			]
		},
		title_eng: {
			type: String, required: true, trim: true, validate: [
				util.isEmptyValidator
			]
		},
		active: {type: Boolean, default: true},
		partyId: {type: Number},
		description_eng: {type: String},
		description_ol: {type: String},
		cover_picture: {type: String},
		start_date: {type: Date},
		end_date: {type: Date},
		location: {
			country: {type: String, trim: true},
			city: {type: String, trim: true},
			address: {type: String},
			longitude: {
				lat: {type: Number},
				lng: {type: Number}
			}
		},
		tkts_avbl_here: {type: Boolean},
		tkt_price: [{
			priceId: {type: Number},
			start_date: {type: Date},
			end_date: {type: Date},
			price: {type: Number},
			currency: {type: String}
		}],
		attendees: [{
			user: {type: Object},
			userId: {type: Number},
			ticket_purchase: {type: Boolean},
			purchase_priceId: {type: Number},
			ticket_checkin: {type: Boolean},
			checkin_time: {type: Date},
			attend_mark_time: {type: Date},
			here_mark_time: {type: Date},
			location_ver: {type: Boolean},
			location_ver_time: {type: Date}
		}],
        likes: [{
            user: {type: Object},
            userId: {type: Number},
            likeTime: {type: Date}
        }],
        comments:[{
            commentId: {type: Number, required: true, index: {unique: true}},
            user: {type: Object},
            createdAt: {type: Date},
            deletedAt: {type: Date},
            content: {type: String},
            liked: [{user: {type: Object}}]
        }],
        announcements: [{
            announcementId: {type: Number, required: true, index: {unique: true}},
            user: {type: Object},
            createdAt: {type: Date},
            deletedAt: {type: Date},
            content: {type: String},
            liked: [{user: {type: Object}}]
        }],
		managers: [
			{
				userId: {type: Number},
				permission_level: {type: Number}
			}
		],
		notifications: [{
			notificationId: {type: Number},
			time: {type: Date},
			content: {type: String},
			link: {type: String},
			sender: {type: Number},
			audience: []
		}],
		remarks: {type: String, trim: true},
		age_range: {
			min: {type: String},
			max: {type: String}
		}
	},
	{
		toObject: {virtuals: true},
		toJSON: {virtuals: true}
	}
);

EventSchema.statics.countByDate = function (type = 'eq', date = Date.now()) {

	let string_from = moment(date).format('YYYY-MM-DD');

	let from = new Date(string_from); // today
	let to = moment(from).add(1, 'd').toDate(); // tomorrow
	let eventModel = this.model('Event');

	let condition;
	switch (type) {
		case 'eq':
			condition = {$gt: from, $lt: to};
			break;
		case 'gt':
			condition = {$gt: to};
			break;
		case 'lt':
			condition = {$lt: from};
	}

	return eventModel.count({start_date: condition});

};

// validate on update
EventSchema.pre('update', function (next) {
	this.options.runValidators = true;
	next();
});

EventSchema.plugin(autoIncrement.plugin, {
	model: 'Event',
	field: 'id',
	startAt: 1221
});

EventSchema.virtual('attendees.user', {
	ref: 'User',
	localField: 'attendees.userId',
	foreignField: 'id',
	justOne: true // for many-to-1
});

let autoPopulateUser = function (next) {
	this.populate('attendees.user');
	next();
};

EventSchema.pre('findOne', autoPopulateUser).pre('find', autoPopulateUser);

// validate on update
EventSchema.pre('update', function (next) {
	this.options.runValidators = true;
	next();
});

EventSchema.virtual('image').get(function () {
	return util.getImage(this, 'cover_picture', default_image_event);
});

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema);
