const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dish",
    },
  ],
});
module.exports = mongoose.model("favorite", favoriteSchema);
