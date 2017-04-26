var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var LineSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	line_name_eng: {type: String,trim:true},
	line_name_ol: {type: String,trim:true},
	description_eng: {type: String,trim:true},
	description_ol: {type: String,trim:true},
	country: {type: String,trim:true},
	city: {type: String,trim:true},
	facebook_page: {type: String,trim:true},
	website: {type: String,trim:true},
	phone_number: {type: String,trim:true},
	cover_picture: {type: String,trim:true},
	managers:[{
		userid:{type:Number}
	}],
	music:{
		music_genres:[{type:String}],
		music_sample:{type:String}
	}
});

LineSchema.plugin(autoIncrement.plugin, {
	model: 'Line',
	field: 'id',
	startAt: 1
});

module.exports = mongoose.model('Line', LineSchema);