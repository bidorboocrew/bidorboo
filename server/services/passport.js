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

//localAtuh
const LocalStrategyConfig = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
};

passport.use(
  'local-register',
  new LocalStrategy(LocalStrategyConfig, async (req, email, password, done) => {
    try {
      if (!email || !password) {
        return done(
          {
            errorMsg:
              'invalid inputs either username or password was not provided'
          },
          null
        );
      }

      const existingUser = await userDataAccess.findOneByemail(email);
      if (existingUser) {
        return done(
          { errorMsg: 'a user with the same email already exists' },
          null
        );
      }

      const userDetails = {
        userId: email,
        email: email,
        password: password,
        profileImgUrl: 'https://goo.gl/92gqPL'
      };

      const user = await userDataAccess.registerNewUserWithPassword(userDetails)
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
      const existingUser = await userDataAccess.findOneByemail(email);
      if (existingUser) {
        const isValidPassword = await userDataAccess.checkUserPassword(
          password,
          existingUser.password
        );
        if (isValidPassword) {
          //successfully logged in
          return done(null, existingUser);
        } else {
          //invalid password try again
          return done(null, {
            errorMsg: 'Username or password provided are invalid'
          });
        }
      } else {
        return done(null, {
          errorMsg: 'Username or password provided are invalid'
        });
      }
    } catch (err) {
      return done(null, {
        errorMsg: 'error during authentication',
        details: err
      });
    }
  })
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
      try {
        const existingUser = await userDataAccess.findOneByUserId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        const userDetails = {
          userId: profile.id,
          email: profile.emails ? profile.emails[0].value : '',
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
