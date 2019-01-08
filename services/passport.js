const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); //one arg means load, two args mean write

passport.serializeUser( (user, done) => {
	done(null, user.id);
});

passport.deserializeUser( (id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
	 {
		clientID: keys.googleClientID,
		clientSecret: keys.googleClientSecret,
		callbackURL: '/auth/google/callback'
	 },
	 (accessToken, refreshToken, profile, done) => {
	 	//handles mongoose action onto mongodb
	 	User.findOne( { googleId: profile.id } ).then( existingUser => {
	 		if (existingUser){
	 			done(null, existingUser); //done(errorreport, returnobjec)
	 		} else {
	 			new User({ googleId: profile.id }).save()
	 				.then( user => done(null, user)); //tells passport everything is done
	 		}
	 	})
	 }
	)
);