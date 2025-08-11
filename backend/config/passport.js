const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/patient');

passport.use(new GoogleStrategy({
  clientID: '1057780853464-offh9oec6ere0uuic4ekgj8mdbvo6b2d.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: '1057780853464-offh9oec6ere0uuic4ekgj8mdbvo6b2d.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = await User.create({ facebookId: profile.id, name: profile.displayName, email: profile.emails[0].value });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Sathwik2004@',
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
