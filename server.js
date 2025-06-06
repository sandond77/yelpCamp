const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

//section for mongoose connection and database connection
main().catch((err) => console.log(`connection error: ${err}`));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const Campground = require('./models/campground');

//EJS setup with express and folder directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: true })); //allows express to parse json
app.use(express.static(__dirname + '/public')); //for serving static pages;

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', { campground });
});

app.post('/campgrounds', async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
