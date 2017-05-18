let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

let PartySchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	lineId: {type: Number},
	title_ol: {type: String, trim: true},
	title_eng: {type: String, trim: true},
	mom_eventId: {type: Number},
	only_for_mom_event_att: {type: Boolean},
	description_eng: {type: String, trim: true},
	description_ol: {type: String, trim: true},
	cover_picture: {type: String, trim: true},
	facebook_page: {type: String, trim: true},
	date: {type: Date },
	open_time: {type: String },
	location: {
		club_name: {type: String, trim: true},
		country: {type: String, trim: true},
		city: {type: String, trim: true},
		address: {type: String},
		longitude: {
			lat: { type: Number},
			lng: { type: Number}
		}
	},
	tkts_avbl_here: {type: Boolean},
	tkt_price: [{
		price_id: {$inc: {type: Number, index: {unique: true}}},
		start_date: {type: Date, default: Date.now},
		end_date: {type: Date, default: Date.now},
		price: {type: Number},
		currency: {type: String}
	}],
	active: {type: Boolean}
});

PartySchema.plugin(autoIncrement.plugin, {
	model: 'Party',
	field: 'id',
	startAt: 1
});


PartySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Party', PartySchema);