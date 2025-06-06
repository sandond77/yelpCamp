const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

const Campground = require('./models/campground');

main().catch((err) => console.log(`connection error: ${err}`));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/makeCampground', async (req, res) => {
	try {
		const camp = new Campground({
			title: 'test1',
			description: 'this is a sample description'
		});
		await camp.save();
		res.send(camp);
	} catch (error) {
		console.log(`error occured: ${error}`);
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
