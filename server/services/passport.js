const passport = require('passport');

const mongoose = require('mongoose');
const User = mongoose.model('users');


//we send this serialized obj to the client side
passport.serializeUser((user, done)=>{
    done(null, user.id)
})

//we know how to process the info from client into server object
passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
})

const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id, name: profile.displayName })
            .save()
            .then(user => {
              done(null, user);
            });
        }
      });
    }
  )
);
