let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');
let moment = require('moment');

autoIncrement.initialize(mongoose.connection);

let EventSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	title_ol: {type: String},
	active: {type: Boolean, default: true},
	title_eng: {type: String},
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
	tkt_price: {
		priceId: {type: Number},
		start_date: {type: Date},
		end_date: {type: Date},
		price: {type: Number},
		currency: {type: String}
	},
	attendees: {
		userId: {type: Number},
		ticket_purchase: {type: Boolean},
		purchase_priceId: {type: Number},
		ticket_checkin: {type: Boolean},
		checkin_time: {type: Date},
		attend_mark_time: {type: Date},
		here_mark_time: {type: Date},
		location_ver: {type: Boolean},
		location_ver_time: {type: Date}
	},
	managers: [],
	notifications: {
		notificationId: {type: Number},
		time: {type: Date},
		content: {type: String},
		link: {type: String},
		sender: {type: Number},
		audience: []
	}
});

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

EventSchema.plugin(autoIncrement.plugin, {
	model: 'Event',
	field: 'id',
	startAt: 1
});

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema);