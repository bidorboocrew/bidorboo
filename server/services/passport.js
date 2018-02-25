const passport = require('passport');
const ROUTES = require('../route_constants');

const userDataAccess = require('../data-access/userDataAccess');

const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

//we send this serialized obj to the client side
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

//we know how to process the info from client into server object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDataAccess.findOneByUserId(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// const FacebookPassportConfig = {
//   clientID: keys.facebookClientID,
//   clientSecret: keys.facebookClientSecret,
//   callbackURL: ROUTES.AUTH.FACEBOOK_CALLBACK
// };
// //facebook Auth
// passport.use(
//   new FacebookStrategy(
//     FacebookPassportConfig,
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await userDataAccess.findOneByUserId(profile.id);
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       const user = await userDataAccess.createNewUser(profile);
//       done(null, user);
//     }
//   )
// );

// google Auth
const GooglePassportConfig = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: ROUTES.AUTH.GOOGLE_CALLBACK,
  proxy: true
};
passport.use(
  new GoogleStrategy(
    GooglePassportConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userDataAccess.findOneByUserId(profile.id);
        if (existingUser) {
          done(null, existingUser);
        }
        const userEmail= profile.emails ? profile.emails[0].value : '';
        const userDetails = {
          displayName: profile.displayName,
          userId: profile.id,
          email: userEmail,
          profileImgUrl: profile.photos
            ? profile.photos[0].value
            : 'https://goo.gl/92gqPL'
        };

        const user = await userDataAccess.createNewUser(userDetails);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
