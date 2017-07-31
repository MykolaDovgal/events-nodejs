let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let autoIncrement = require('mongoose-auto-increment');
let mongoosePaginate = require('mongoose-paginate');


let config = require('config');
let util = require('util/index');
let default_image_line = config.get('images:default_image_line');

autoIncrement.initialize(mongoose.connection);

let LineSchema = new Schema({
		id: {type: Number, required: true, index: {unique: true}},
		active: {type: Boolean, default: true},
		line_name_eng: {
			type: String, trim: true, validate: [
				util.isEmptyValidator
			]
		},
		line_name_ol: {
			type: String, trim: true, validate: [
				util.isEmptyValidator
			]
		},
		description_eng: {type: String, trim: true},
		description_ol: {type: String, trim: true},
		facebook_page: {type: String, trim: true},
		website: {type: String, trim: true},
		phone_number: {type: String, trim: true},
		cover_picture_original: {type: String, trim: true},
		cover_picture: {type: String, trim: true},
		followers: [{
			user: {type: Object},
			userId: {type: Number},
			times_attended: {type: Number},
			last_attendence: {type: Date}
		}],
        likes: [{
            userId: {type: Schema.Types.ObjectId},
            likeTime: {type: Date}
        }],
        comments:[{
            commentId: {type: Schema.Types.ObjectId},
            userId: {type: Schema.Types.ObjectId},
            createdAt: {type: Date},
            deletedAt: {type: Date},
            content: {type: String},
            likes: [{type: Schema.Types.ObjectId}]
        }],
        announcements: [{
            announcementId: {type: Number, required: true, index: {unique: true}},
            userId: {type: Schema.Types.ObjectId},
            createdAt: {type: Date},
            deletedAt: {type: Date},
            content: {type: String},
            likes: [{type: Schema.Types.ObjectId}]
        }],
        pictures: [{
            picture: {type: Schema.Types.ObjectId},
            pictureUrl: {type: string},
            uploadedAt: {type: Date},
            uploader: {type: Schema.Types.ObjectId},
            isPrivate: {type: Boolean},
            isOfficial: {type: Boolean},
            comments: [{
                commentId: {type: Schema.Types.ObjectId},
                userId: {type: Schema.Types.ObjectId},
                createdAt: {type: Date},
                deletedAt: {type: Date},
                content: {type: String},
                liked: [{type: Schema.Types.ObjectId}]
            }],
            tagged: [{type: Schema.Types.ObjectId}],
            likes: [{type: Schema.Types.ObjectId}]

        }],
		managers: [
			{
				user_id: {type: Number},
				permission_level: {type: Number}
			}
		],
		music: {
			music_genres: [{type: String}],
			music_sample: {type: String}
		},
		address: {
			address: {type: String, trim: true},
			city: {type: String, trim: true},
			country: {type: String, trim: true},
			countryCode: {type: String, trim: true},
			latitude: {type: Number},
			longitude: {type: Number}
		},
		notifications: [{
			notificationId: {type: Number},
			time: {type: Date},
			content: {type: String},
			link: {type: String},
			sender: {type: Number},
			audience: {type: String}
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

LineSchema.virtual('image').get(function () {
	return util.getImage(this, 'cover_picture', default_image_line);
});

LineSchema.plugin(autoIncrement.plugin, {
	model: 'Line',
	field: 'id',
	startAt: 1
});

LineSchema.plugin(mongoosePaginate);

// validate on update
LineSchema.pre('update', function (next) {
	this.options.runValidators = true;
	next();
});

module.exports = mongoose.model('Line', LineSchema);