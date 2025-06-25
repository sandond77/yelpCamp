const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOveride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;

//backend validation for forms
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {
	campgroundValidationSchema,
	reviewValidationSchema
} = require('./validationSchemas');

//models
const Campground = require('./models/campground');
const Review = require('./models/review');

//routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//section for mongoose connection and database connection
main().catch((err) => console.log(`connection error: ${err}`));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//EJS setup with express and folder directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: true })); //allows express to parse json
app.use(express.static(__dirname + '/public')); //for serving static pages;
app.use(methodOveride('_method')); //for using different crud methods on form submission

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
	res.redirect('/campgrounds');
});

app.all(/.*/, (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) {
		err.message = 'Internal Server Error';
	}
	res.status(statusCode).render('error', { err, statusCode });
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
