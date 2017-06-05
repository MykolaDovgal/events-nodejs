let express = require('express');
let Promise = require('bluebird');
let config = require('config');

let Line = require('models/Line');

let router = express.Router();

let text = {
	'empty': config.get('text:empty')
};


// get all lines
router.get('/api/getAllLines', function (req, res, next) {

	let search = req.query.q || '';

	let filter_search = [
		{'line_name_eng': new RegExp(search, "i")},
		{'line_name_eng': new RegExp(search, "i")},
		{'description_ol': new RegExp(search, "i")},
		{'description_eng': new RegExp(search, "i")},
		{'website': new RegExp(search, "i")},
		{'facebook_page': new RegExp(search, "i")},
		{'phone_number': new RegExp(search, "i")},
		{'address.city': new RegExp(search, "i")},
		{'address.country': new RegExp(search, "i")},
		{'music.music_genres': new RegExp(search, "i")}
	];

	Promise.props({
		lines: Line.find({$or: filter_search}).execAsync()
	})
		.then(function (results) {
			let data = [{
				id: -1,
				text: text.empty
			}];


			results.lines.forEach(function (line, index) {

				// if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
				// 	user.profile_picture_circle = default_image_user;

				data.push({
					id: line.id,
					text: line.line_name_eng,
				});
			});

			res.json(data);
		})
		.catch(function (err) {
			next(err)
		});
});

module.exports = router;