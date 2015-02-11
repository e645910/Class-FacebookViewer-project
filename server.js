var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();
var port = 9001;

app.use(session({
	secret: 'SOME_SECRET', 
	resave: true, 
	saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: '682655431842895',
	clientSecret: '32b08269311dec35985ab015feb49165',
	callbackURL: 'http://localhost:9001/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	return done(null, profile);
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
 	done(null, obj);
});

var isAuthed = function(req, res, next){
	if(!req.isAuthenticated()){
		res.redirect('/failure');
	}
	else { 
		next();
	}
}

app.get('/me', isAuthed, function(req, res) {
	res.json(req.user);
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/failure'
}
))

app.listen(9001, function(){
	console.log('now listening on port:' + port)
})