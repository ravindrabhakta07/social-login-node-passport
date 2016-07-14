var passport = require('passport');
var DropboxStrategy = require('passport-dropbox').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new DropboxStrategy({
    consumerKey: config.dropbox.consumerKey,
    consumerSecret: config.dropbox.consumerSecret,
    callbackURL: config.dropbox.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      name: profile.displayName
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      accessToken: accessToken
    };

    var options = {
      upsert: true
    };
    

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
init();


module.exports = passport;
