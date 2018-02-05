const passport = require('passport');

const userDataAccess = require('../data-access/userDataAccess');

const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//we send this serialized obj to the client side
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//we know how to process the info from client into server object
passport.deserializeUser((id, done) => {
  debugger;
  userDataAccess.getUserById(passport, id).then(user => {
    done(null, user);
  });
});

const FacebookPassportConfig = {
  clientID: keys.facebookClientID,
  clientSecret: keys.facebookClientSecret,
  callbackURL: '/auth/facebook/callback'
};
//facebook Auth
passport.use(
  new FacebookStrategy(
    FacebookPassportConfig,
    (accessToken, refreshToken, profile, done) => {
      userDataAccess.getOneUserWithId(profile.id).then(exisitingUser => {
        if (exisitingUser) {
          done(null, exisitingUser);
        } else {
          userDataAccess.createNewUser(profile).then(user => {
            done(null, user);
          });
        }
      });
    }
  )
);

// google Auth

const GooglePassportConfig = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
};
passport.use(
  new GoogleStrategy(
    GooglePassportConfig,
    (accessToken, refreshToken, profile, done) => {
      userDataAccess.getOneUserWithId(profile.id).then(exisitingUser => {
        if (exisitingUser) {
          done(null, exisitingUser);
        } else {
          userDataAccess.createNewUser(profile).then(user => {
            done(null, user);
          });
        }
      });
    }
  )
);
