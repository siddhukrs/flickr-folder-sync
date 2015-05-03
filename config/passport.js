var FlickrStrategy = require('passport-flickr').Strategy;
var configAuth = require('./auth');
var User = require('../app/models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
    	User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FlickrStrategy({
	    consumerKey		        : configAuth.flickrAuth.clientID,
	    consumerSecret	        : configAuth.flickrAuth.clientSecret,
	    callbackURL             : configAuth.flickrAuth.callbackURL,
        userAuthorizationURL    : configAuth.flickrAuth.authURL

  	},

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'flickr.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                if (user)
                {
                    return done(null, user);
                }
                else
                {
                    console.log(profile);
                    var newUser = new User();
                    newUser.flickr.id    = profile.id;
                    newUser.flickr.token = token;
                    newUser.flickr.name  = profile.fullName;
                    newUser.flickr.displayName = profile.displayName;
                    newUser.save(function(err)
                    {
                        if (err)
                            throw err;
                        return
                            done(null, newUser);
                    });
                }
            });
        });
    }));
};