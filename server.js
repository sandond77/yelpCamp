const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOveride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');

//section for mongoose connection and database connection
main().catch((err) => console.log(`connection error: ${err}`));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const Campground = require('./models/campground');

//EJS setup with express and folder directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: true })); //allows express to parse json
app.use(express.static(__dirname + '/public')); //for serving static pages;
app.use(methodOveride('_method')); //for using different crud methods on form submission

const validateCampground = (req, res, next) => {
	const campgroundSchema = Joi.object({
		campground: Joi.object({
			title: Joi.string().required(),
			price: Joi.number().required().min(0),
			image: Joi.string().required(),
			location: Joi.string().required(),
			description: Joi.string().required()
		}).required()
	});

	const { error } = campgroundSchema.validate(req.body);
	console.log(error);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

app.get('/', (req, res) => {
	res.redirect('/campgrounds');
});

app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

app.post(
	'/campgrounds',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/show', { campground });
	})
);

app.put(
	'/campgrounds/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground
		});
		res.redirect(`/campgrounds/${id}`);
	})
);

app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findById(id);
		res.render('campgrounds/edit', { campground });
	})
);

app.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	})
);

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
