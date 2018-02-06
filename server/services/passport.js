const passport = require('passport');
const ROUTES = require('../routes/route_constants');

const userDataAccess = require('../data-access/userDataAccess');

const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//we send this serialized obj to the client side
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//we know how to process the info from client into server object
passport.deserializeUser(async (id, done) => {
  const user = await userDataAccess.getUserById(passport, id);
  debugger;
  done(null, user);
});

const FacebookPassportConfig = {
  clientID: keys.facebookClientID,
  clientSecret: keys.facebookClientSecret,
  callbackURL: ROUTES.AUTH.FACEBOOK_CALLBACK
};
//facebook Auth
passport.use(
  new FacebookStrategy(
    FacebookPassportConfig,
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await userDataAccess.getOneUserWithId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await userDataAccess.createNewUser(profile);
      done(null, user);
    }
  )
);

// google Auth

const GooglePassportConfig = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: ROUTES.AUTH.GOOGLE_CALLBACK
};
passport.use(
  new GoogleStrategy(
    GooglePassportConfig,
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await userDataAccess.getOneUserWithId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await userDataAccess.createNewUser(profile);
      debugger
      done(null, user);
    }
  )
);
