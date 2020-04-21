const express = require("express");
const app = express();
const dishRouter = require("./routes/dishRouter");
const leaderRouter = require("./routes/leaderRouter");
const promoRouter = require("./routes/promoRouter");
const hostname = "localhost";
const PORT = 3000;
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

app.listen(PORT, hostname, () => {
  console.log("Server is listening on port "+PORT);
});
