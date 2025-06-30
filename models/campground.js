const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews //will remove all ids thats in the doc.review object
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
