const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch((err) => console.log(`connection error: ${err}`));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '686229bb7c799b35821c0bbf',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/dd00cd87d/image/upload/v1751431164/YelpCamp/sdoygh05x2i7mxezqifb.jpg',
					filename: 'YelpCamp/sdoygh05x2i7mxezqifb'
				},
				{
					url: 'https://res.cloudinary.com/dd00cd87d/image/upload/v1751431163/YelpCamp/ivpdpuvk14wddikix6qv.jpg',
					filename: 'YelpCamp/ivpdpuvk14wddikix6qv'
				},
				{
					url: 'https://res.cloudinary.com/dd00cd87d/image/upload/v1751431164/YelpCamp/jtglopluctg5270lbegl.jpg',
					filename: 'YelpCamp/jtglopluctg5270lbegl'
				}
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
			price,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude]
			}
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
	console.log('closing mongod connection');
});
