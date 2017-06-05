let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');
let moment = require('moment');

autoIncrement.initialize(mongoose.connection);

let PartySchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	lineId: {type: Number},
	title_ol: {type: String, trim: true, required: true},
	title_eng: {type: String, trim: true, required: true},
	eventId: {type: Number},
	only_for_event_att: {type: Boolean},
	description_eng: {type: String, trim: true},
	description_ol: {type: String, trim: true},
	cover_picture_original: {type: String, trim: true},
	cover_picture: {type: String, trim: true},
	facebook_page: {type: String, trim: true},
	date: {type: Date},
	video_stream_avbl: {type: Boolean, default: false},
	video_stream_on: {type: Boolean, default: false},
	video_stream: {type: String, trim: true},
	party_managers: [
		{userId: {type: Number}}
	],
	location: {
		club_name: {type: String, trim: true},
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
		start_date: {type: Date},
		end_date: {type: Date},
		price: {type: Number},
		currency: {type: String}
	}],
	active: {type: Boolean},
	attendees: [{
		user: {type: Object},
		userId: {type: Number},
		ticket_purchase: {type: Boolean},
		purchase_priceId: {type: String},
		ticket_checkin: {type: Boolean},
		checkin_time: {type: Date},
		attend_mark_time: {type: Date},
		here_mark_time: {type: Date},
		location_ver: {type: Boolean},
		location_ver_time: {type: Date}
	}],
	stage: [{
		stage_name: {type: String},
		music_genres: [{type: String}],
		music_sample: {type: String},
		djs: [{
			name: {type: String},
			userId: {type: Number},
			soundcloud: {type: String}
		}]
	}],
	bar: [{
		barId: {type: Number},
		bar_tend: {type: Number},
		bar_name_ol: {type: String, trim: true},
		bar_name_eng: {type: String, trim: true},
		party_managers: [
			{userId: {type: Number}}
		],
		drinkCategories: [
			{
				category_name: {type: String},
				drinksId: [{type: String}]
			}
		],
		drinks: {
			list: [
				{
					drinkname_ol: {type: String},
					drinkname_eng: {type: String},
					serve_method: {type: String},
					volume: {type: String},
					price: {type: Number},
					in_stock: {type: Boolean}
				}
			]
		}
	}]
});

PartySchema.statics.countByDate = function (type = 'eq', date = Date.now()) {

	let string_from = moment(date).format('YYYY-MM-DD');

	let from = new Date(string_from); // today
	let to = moment(from).add(1, 'd').toDate(); // tomorrow
	let partyModel = this.model('Party');

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

	return partyModel.count({date: condition});

};


PartySchema.plugin(autoIncrement.plugin, {
	model: 'Party',
	field: 'id',
	startAt: 1
});

PartySchema.virtual('attendees.user', {
	ref: 'User',
	localField: 'attendees.userId',
	foreignField: 'id',
	justOne: true // for many-to-1
});

let autoPopulateUser = function (next) {
	this.populate('attendees.user');
	next();
};

PartySchema.pre('findOne', autoPopulateUser).pre('find', autoPopulateUser);


// validate on update
PartySchema.pre('update', function (next) {
	this.options.runValidators = true;
	next();
});

PartySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Party', PartySchema);