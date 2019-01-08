const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys= require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

//use cookies to handle the authentication
app.use(
	cookieSession({
		maxAge: 30 *24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);
//use passport for authentication
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);


//console.developers.google.com

const PORT = process.env.PORT || 5000;
app.listen(PORT);