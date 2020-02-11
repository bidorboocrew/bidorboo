const passport = require('passport');
const ROUTES = require('../backend-route-constants');
const LocalStrategy = require('passport-local').Strategy;
const uuidv4 = require('uuid/v4');

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
    return done(e, null);
  }
});

const FacebookPassportConfig = {
  clientID: keys.facebookClientID,
  clientSecret: keys.facebookClientSecret,
  callbackURL: ROUTES.API.AUTH.FACEBOOK_CALLBACK,
  proxy: true,
  enableProof: true,
  profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'emails'],
  passReqToCallback: true,
};
//facebook Auth
passport.use(
  new FacebookStrategy(
    FacebookPassportConfig,
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userDataAccess.findOneByUserId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        const userEmail = profile.emails ? profile.emails[0].value : '';
        if (userEmail) {
          const anotherUserExistsWithSameEmail = await userDataAccess.checkIfUserEmailAlreadyExist(
            userEmail
          );
          if (anotherUserExistsWithSameEmail) {
            return done(
              new Error(
                'a user with the same email already exists. You can Chat with our customer support for further help'
              ),
              null
            );
          }
        }

        const userDetails = {
          isFbUser: true,
          displayName: profile.displayName,
          userId: profile.id,
          email: { emailAddress: userEmail, isVerified: true },
          profileImage: {
            url: profile.photos
              ? profile.photos[0].value
              : 'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1565728175/android-chrome-512x512.png',
          },
        };

        const user = await userDataAccess.createNewUser(userDetails);

        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

// google Auth
const GooglePassportConfig = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: ROUTES.API.AUTH.GOOGLE_CALLBACK,
  proxy: true,
  passReqToCallback: true,
};
passport.use(
  new GoogleStrategy(
    GooglePassportConfig,
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userDataAccess.findOneByUserId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }
        const userEmail = profile.emails ? profile.emails[0].value : '';
        if (userEmail) {
          const anotherUserExistsWithSameEmail = await userDataAccess.checkIfUserEmailAlreadyExist(
            userEmail
          );
          if (anotherUserExistsWithSameEmail) {
            return done(
              new Error(
                'a user with the same email already exists. You can Chat with our customer support for further help'
              ),
              null
            );
          }
        }
        const userDetails = {
          isGmailUser: true,
          displayName: profile.displayName,
          userId: profile.id,
          email: { emailAddress: userEmail, isVerified: true },
          profileImage: {
            url: profile.photos
              ? profile.photos[0].value
              : 'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1565728175/android-chrome-512x512.png',
          },
        };

        const user = await userDataAccess.createNewUser(userDetails);

        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
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
        return done(new Error('invalid inputs either username or password was not provided'), null);
      }
      const trimmedEmail = email.trim();
      const existingUser = await userDataAccess.checkIfUserAlreadyExist(trimmedEmail, trimmedEmail);
      if (existingUser) {
        return done(
          new Error(
            'A user with the same email already exists, if you forgot your password click on reset credentials'
          ),
          null
        );
      }

      const userDetails = {
        userId: uuidv4(),
        email: { emailAddress: email },
        password: password,
        displayName: req.body.displayName,
        profileImgUrl:
          'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1565728175/android-chrome-512x512.png',
      };

      const user = await userDataAccess.createNewUser(userDetails);
      done(null, user);
    } catch (err) {
      console.error('Failed To local-register Auth' + err);
      return done(err, null);
    }
  })
);
passport.use(
  'local-login',
  new LocalStrategy(LocalStrategyConfig, async (req, email, password, done) => {
    try {
      if (!email || !password) {
        return done(new Error('invalid inputs either username or password was not provided'), null);
      }

      const existingUser = await userDataAccess.findOneByEmailId(email, false);
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
      return done(err, null);
    }
  })
);
