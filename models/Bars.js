let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');
let moment = require('moment');
let util = require('util/index');

autoIncrement.initialize(mongoose.connection);

let BarSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	bar_name_eng: {type: String},
	ber_name_ol: {type: String},
	description_eng: {type: String},
	description_ol: {type: String},
	location: {
		country:{type: String},
		city:{type: String},
		address:{type: String},
		coordinate: {
			lat: {type: Number},
			lng: {type: Number}
		}
	},
	facebook_page: {type: String},
	website: {type: String},
	phone_number: {type: String},
	cover_picture: {type: String},
	managers: [ {userId: {type: String},} ],
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
	followers: [{
			userId:{type: Number},
			mark_time: {type: Date}
		}],
	music: [{
		date: {type: Date},
		music_genres: [{type: String}],
		music_sample: {type: String},
		djs: [{
			name: {type: String},
			userId: {type: Number},
			soundcloud: {type: String}
		}]
	}],
	notifications: [{
		notificationId: {type: Number},
		time: {type: Date},
		content: {type: String},
		link: {type: String},
		sender: {type: Number},
		audience: []
	}],
	opening_times: {
		sunday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		monday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		tuesday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		wednesday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		thursday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		friday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		},
		saturday:{
			open:{type: String},
			close: {type: String},
			notes: {type: String}
		}
	}
});


BarSchema.plugin(autoIncrement.plugin, {
	model: 'Bar',
	field: 'id',
	startAt: 1
});



BarSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Bar', BarSchema);