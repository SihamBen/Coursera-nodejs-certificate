const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const config = require("./config.js");

exports.getToken = function(user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
// Verify if the user is an Admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin === true) {
    return next();
  } else {

    err = new Error("Admin only");
    err.status = 403;
    return next(err);
  }
};

// Verify if the user is authenticated
exports.verifyUser = passport.authenticate("jwt", { session: false });
