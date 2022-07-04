const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingDriversSchema = new Schema({
  location: { type: String },
  vehicleType: { type: String },
  email: { type: String },
});

module.exports = mongoose.model("pendingDrivers", pendingDriversSchema);
