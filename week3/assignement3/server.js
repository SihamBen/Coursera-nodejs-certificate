const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const FileStore = require("session-file-store")(session);
const config = require("./config");
const dishRouter = require("./routes/dishRouter");
const leaderRouter = require("./routes/leaderRouter");
const userRouter = require("./routes/userRouter");
const promoRouter = require("./routes/promoRouter");
const Dishes = require("./models/dishes");
const hostname = "localhost";
const PORT = 3000;

//Connect with Database
const url = config.mongourl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect
  .then(() => {
    console.log("connected");
  })
  .catch(err => {
    console.log("connected");
  });
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev!"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

app.listen(PORT, hostname, () => {
  console.log("Server is listening on port " + PORT);
});
