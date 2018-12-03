const passport = require('passport');
const ROUTES = require('../backend-route-constants');

const userDataAccess = require('../data-access/userDataAccess');

const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//we send this serialized obj to the client side
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

//we know how to process the info from client into server object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDataAccess.findSessionUserById(id);
    return done(null, user);
  } catch (e) {
    return done({ errorMsg: 'Failed To deserializeUser', details: e }, null);
  }
});

const FacebookPassportConfig = {
  clientID: keys.facebookClientID,
  clientSecret: keys.facebookClientSecret,
  callbackURL: ROUTES.API.AUTH.FACEBOOK_CALLBACK,
  proxy: true,
  profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'emails'],
};
//facebook Auth
passport.use(
  new FacebookStrategy(FacebookPassportConfig, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await userDataAccess.findOneByUserId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }
      const userEmail = profile.emails ? profile.emails[0].value : '';
      const userDetails = {
        displayName: profile.displayName,
        userId: profile.id,
        email: userEmail,
        profileImage: {
          url: profile.photos ? profile.photos[0].value : 'https://goo.gl/92gqPL',
        },
      };

      const user = await userDataAccess.createNewUser(userDetails);
      return done(null, user);
    } catch (e) {
      return done({ errorMsg: 'Failed To facebook Auth', details: e }, null);
    }
  })
);

// google Auth
const GooglePassportConfig = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: ROUTES.API.AUTH.GOOGLE_CALLBACK,
  proxy: true,
};
passport.use(
  new GoogleStrategy(GooglePassportConfig, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await userDataAccess.findOneByUserId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }
      const userEmail = profile.emails ? profile.emails[0].value : '';
      const userDetails = {
        displayName: profile.displayName,
        userId: profile.id,
        email: userEmail,
        profileImage: {
          url: profile.photos ? profile.photos[0].value : 'https://goo.gl/92gqPL',
        },
      };

      const userWithMongoSchema = await userDataAccess.createNewUser(userDetails);
      // to save data usage ommit all the mongoose specific magic and remove it from the obj
      const userObject = userWithMongoSchema.toObject();
      return done(null, userObject);
    } catch (e) {
      return done({ errorMsg: 'Failed To Google Auth', details: e }, null);
    }
  })
);
