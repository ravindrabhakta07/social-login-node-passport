var passport = require('passport');
var WindowsLiveStrategy = require('passport-windowslive').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new WindowsLiveStrategy({

    clientID: config.windowslive.clientID,
  clientSecret: config.windowslive.clientSecret,
  callbackURL: config.windowslive.callbackURL
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
