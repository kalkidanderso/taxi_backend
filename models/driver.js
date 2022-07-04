const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriversSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  profileImage: { type: String },
  city: { type: String },
  address: { type: String },
  vehicleType: { type: String },
});

module.exports = mongoose.model("Driver", DriversSchema);
