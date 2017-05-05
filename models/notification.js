let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

let NotificationSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	time: {type: Date, default: Date.now },
	content: {type: String, trim: true},
	link: {type: String, trim: true},
	sender: {type: String, trim: true},
	audience: {type: String, trim: true},
});

NotificationSchema.plugin(autoIncrement.plugin, {
	model: 'Notification',
	field: 'id',
	startAt: 1
});

NotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Notification', NotificationSchema);