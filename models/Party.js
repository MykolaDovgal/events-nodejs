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
	description_eng: {type: String, trim: true},
	description_ol: {type: String, trim: true},
	cover_picture: {type: String, trim: true},
	date: {type: Date, default: Date.now },
	open_time: {type: Date, default: Date.now},
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
	tkt_price: {
		price_id: {type: Number},
		start_date: {type: Date, default: Date.now},
		end_date: {type: Date, default: Date.now},
		price: {type: Number},
		currency: {type: String}
	}

});

PartySchema.plugin(autoIncrement.plugin, {
	model: 'Party',
	field: 'id',
	startAt: 1
});

PartySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Party', PartySchema);