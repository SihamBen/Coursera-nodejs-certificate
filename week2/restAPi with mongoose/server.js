const express = require("express");
const app = express();
const mongoose=require("mongoose");
const dishRouter = require("./routes/dishRouter");
const leaderRouter = require("./routes/leaderRouter");
const promoRouter = require("./routes/promoRouter");
const Dishes=require("./models/dishes");
const hostname = "localhost";
const PORT = 3000;

//Connect with Database
const url = 'mongodb://localhost:27017/test4';
const connect = mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true });
connect.then(()=>{
  console.log('connected')
}).catch((err)=>{
  console.log('connected');
})

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

app.listen(PORT, hostname, () => {
  console.log("Server is listening on port "+PORT);
});
