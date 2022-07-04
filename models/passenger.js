const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passengerSchema = new Schema({
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("Passenger", passengerSchema);
