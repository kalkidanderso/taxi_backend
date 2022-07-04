const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingRidesSchema = new Schema({
  pickupLocation: { type: String },
  destination: { type: String },
  totalBusPassenger: { type: Number },
  totalVipPassenger: { type: Number },
});

module.exports = mongoose.model("pendingRides", pendingRidesSchema);
