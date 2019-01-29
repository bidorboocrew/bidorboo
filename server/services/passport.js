const passport = require('passport');
const ROUTES = require('../backend-route-constants');
const LocalStrategy = require('passport-local').Strategy;

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
    return done({ errorMsg: 'Failed To deserializeUser', details: `${e}` }, null);
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
        email: { emailAddress: userEmail },
        profileImage: {
          url: profile.photos ? profile.photos[0].value : 'https://www.clipartmax.com/png/small/4-44271_big-image-default-user-profile-image-png.png',
        },
      };

      const user = await userDataAccess.createNewUser(userDetails);

      return done(null, { ...user, stripeConnect: {} });
    } catch (e) {
      return done({ errorMsg: 'Failed To facebook Auth', details: `${e}` }, null);
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
        email: { emailAddress: userEmail },
        profileImage: {
          url: profile.photos ? profile.photos[0].value : 'https://www.clipartmax.com/png/small/4-44271_big-image-default-user-profile-image-png.png',
        },
      };

      const user = await userDataAccess.createNewUser(userDetails);

      return done(null, { ...user, stripeConnect: {} });
    } catch (e) {
      return done({ errorMsg: 'Failed To create user via google login', details: `${e}` }, null);
    }
  })
);

const LocalStrategyConfig = {
  successRedirect: '',
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};
passport.use(
  'local-register',
  new LocalStrategy(LocalStrategyConfig, async (req, email, password, done) => {
    try {
      if (!email || !password || !req.body.displayName) {
        return done(
          {
            errorMsg: 'invalid inputs either username or password was not provided',
          },
          null
        );
      }

      const existingUser = await userDataAccess.findOneByUserId(email);
      if (existingUser) {
        return done(
          JSON.stringify({ errorMsg: 'a user with the same email already exists' }),
          null
        );
      }

      const userDetails = {
        userId: email,
        email: { emailAddress: email },
        password: password,
        displayName: req.body.displayName,
        profileImgUrl: 'https://www.clipartmax.com/png/small/4-44271_big-image-default-user-profile-image-png.png',
      };

      const user = await userDataAccess.createNewUser(userDetails);
      done(null, user);
    } catch (err) {
      done({ errorMsg: 'failed to register user', details: err }, null);
    }
  })
);
passport.use(
  'local-login',
  new LocalStrategy(LocalStrategyConfig, async (req, email, password, done) => {
    try {
      if (!email || !password) {
        return done({
          errorMsg: 'invalid inputs either username or password was not provided',
        });
      }

      const existingUser = await userDataAccess.findOneByUserId(email, false);
      if (!existingUser) {
        return done({ errorMsg: 'invalid credentials' }, null);
      }

      const isTheRightPassword = await existingUser.checkUserPassword(password);

      if (isTheRightPassword) {
        return done(null, existingUser);
      } else {
        return done({ errorMsg: 'invalid credentials' }, null);
      }
    } catch (err) {
      done({ errorMsg: 'failed to login user', details: err }, null);
    }
  })
);
