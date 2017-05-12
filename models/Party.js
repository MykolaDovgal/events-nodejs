let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

let LineSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	lineId: {type: Number},
	title_ol: {type: String, trim: true},
	title_eng: {type: String, trim: true},
	mom_eventId: {type: Number},
	description_eng: {type: String, trim: true},
	description_ol: {type: String, trim: true},
	cover_picture: {type: String, trim: true},
	date: {type: Date },
	open_time: {type: Date },
	location: {
		club_name: {type: String, trim: true},
		country: {type: String, trim: true},
		city: {type: String, trim: true},
		address: {type: Number},
		longitude: {type: Number}
	}

});

LineSchema.plugin(autoIncrement.plugin, {
	model: 'Party',
	field: 'id',
	startAt: 1
});

LineSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Party', LineSchema);