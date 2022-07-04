const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema({
  pickupLocation: { type: String },
  destination: { type: String },
  phoneNumber: { type: String },
  vehicleType: { type: String },
  status: { type: String },
});

module.exports = mongoose.model("history", historySchema);
