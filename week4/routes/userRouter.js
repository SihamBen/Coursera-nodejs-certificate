const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/user");
const passport = require("passport");
const cors = require("./cors");

const authenticate = require("../authenticate");
router.use(bodyParser.json());

//@route GET /users
//@desc Get Users
//@access Private Admin only

router
  
  .get(
    "/",
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      User.find({})
        .then(
          (users) => {
            res.status(200).setHeader("content-Type", "Application/json");
            res.json(users);
          },
          (err) => next(err)
        )
        .catch((err) => {
          next(err);
        });
    }
  );

//@route POST /users/signup
//@desc register a user
//@access Public

router
  
  .post("/signup",    cors.corsWithOptions,
  (req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          if (req.body.firstname) user.firstname = req.body.firstname;
          if (req.body.lastname) user.lastname = req.body.lastname;
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({ err: err });
              return;
            }
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          });
        }
      }
    );
  });

//@route POST /users/login
//@desc login a user
//@access Public

router
  
  .post(
    "/login",
    cors.corsWithOptions,
    passport.authenticate("local"),
    (req, res) => {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  );

//@route GET /users/logout
//@desc logout a user
//@access Private

router.get("/logout", cors.cors, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in");
    err.status = 403;
    return next(err);
  }
});
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
