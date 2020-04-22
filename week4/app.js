const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");
const config = require("./config");
const createError = require("createerror");

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});
const dishRouter = require("./routes/dishRouter");
const indexRouter = require("./routes/index");
const leaderRouter = require("./routes/leaderRouter");
const userRouter = require("./routes/userRouter");
const promoRouter = require("./routes/promoRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

//Connect with Database
const url = config.mongourl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("connected");
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//Intialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Setup Routers
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/uploadImage", uploadRouter);
app.use("/favorites", favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
