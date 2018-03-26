//use github passport strategy
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');

module.exports = function(passport){
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.
/*
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
*/
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});


	passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_KEY,
		clientSecret: process.env.GITHUB_SECRET,
		callbackURL: process.env.APP_URL + 'auth/github/callback'
	},
	/*
	The strategy requires a verify callback, 
	which receives the access token and optional refresh token, 
	as well as profile which contains the authenticated user's GitHub profile. 
	The verify callback must call cb providing a user to complete authentication.
	*/
	function (token, refreshToken, profile, done) {
		//The process.nextTick() method adds the callback to the "next tick queue". 
		//Once the current turn of the event loop turn runs to completion, 
		//all callbacks currently in the next tick queue will be called.
		
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {//the user doesn't exist, then create a new user
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});

	}));
};
