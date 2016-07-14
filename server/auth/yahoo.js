var passport = require('passport');
var YahooStrategy = require('passport-yahoo').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new YahooStrategy({
    consumerKey: config.yahoo.consumerKey,
    consumerSecret: config.yahoo.consumerSecret,
    returnURL: config.yahoo.returnURL
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
