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

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
