if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
app.set('query parser', 'extended');
const session = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const helmet = require('helmet');

//backend validation for forms
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

//models
const Campground = require('./models/campground');
const Review = require('./models/review');

//routes
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

//section for mongoose connection and database connection
const dbUrl = process.env.DB_URL;

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
	// await mongoose.connect(dbUrl);
	console.log('connected to mongod');
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch((err) => console.log(`connection error: ${err}`));

app.use(express.static(path.join(__dirname, 'public'))); //for serving static pages;
app.use(sanitizeV5({ replaceWith: '_' }));

const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net',
	'https://cdn.maptiler.com/'
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://stackpath.bootstrapcdn.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://cdn.jsdelivr.net',
	'https://cdn.maptiler.com/'
];
const connectSrcUrls = ['https://api.maptiler.com/'];

const fontSrcUrls = [];

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dd00cd87d/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				'https://images.unsplash.com/',
				'https://api.maptiler.com/'
			],
			fontSrc: ["'self'", ...fontSrcUrls]
		}
	})
);

//EJS setup with express and folder directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({ extended: true })); //allows express to parse json
app.use(methodOverride('_method')); //for using different crud methods on form submission

//session setup
const sessionConfig = {
	name: 'session',
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true, //for HTTPS security
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires 7 days from issuance
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
	res.render('home');
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
