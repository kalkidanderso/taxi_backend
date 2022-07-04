const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const MongoClient = require("mongodb");

const Passenger = require("../models/passenger");

const history = require("../models/history");
const pendingRides = require("../models/pendingRides");
// const passenger  =  re"../models/passenger";
const getRides = async (req, res, next) => {
  // let hist = history.find();
  // res.status(201).json({ history: hist, message: "retrieved" });

  let hist;
  try {
    hist = await history.find();
    // console.log(driver);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a history.",
      500
    );
    return next(error);
  }
  if (!hist) {
    const error = new HttpError("No Driver in database", 404);
    return next(error);
  }

  res.json({ passengers: hist });
};

const deleteRides = async (req, res, next) => {
  console.log("This is printed");
  const { phoneNumber } = req.body;

  history.deleteOne({ phoneNumber: phoneNumber }).remove().exec();
};
const bookingRides = async (req, res, next) => {
  console.log("This is Booking");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { pickupLocation, destination, vehicleType, phoneNumber } = req.body;
  const status = "pending";
  const createdHistory = new history({
    pickupLocation,
    destination,
    phoneNumber,
    vehicleType,
    status,
  });

  history.find({ phoneNumber: phoneNumber }).remove().exec();
  // console.log(createdHistory);
  // let hists = history.find();

  // hists.map((hist) => {
  //   if (hist.phoneNumber === phoneNumber) {
  //     history.find({ phoneNumber: phoneNumber }).remove().exec();
  //   }
  // });
  createdHistory.save();
  /////////////////////////////////////////

  let totalBusPassenger = req.body.vehicleType === "bus" ? 1 : 0;
  let totalVipPassenger = req.body.vehicleType === "vip" ? 1 : 0;

  let pendingRidess = await pendingRides.find();
  let in_the_pending = false;
  pendingRidess.map((pen) => {
    if (
      pen.pickupLocation === req.body.pickupLocation &&
      pen.destination === req.body.destination
    ) {
      totalBusPassenger += pen.totalBusPassenger;
      totalVipPassenger += pen.totalVipPassenger;
      in_the_pending = true;
    }
  });

  if (in_the_pending) {
    pendingRides
      .deleteOne({ pickupLocation: req.body.pickupLocation })
      .remove()
      .exec();
  }
  //   console.log(req.body.vehicleType);
  const pending = new pendingRides({
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    totalBusPassenger: totalBusPassenger,
    totalVipPassenger: totalVipPassenger,
  });

  /////////////////////////
  try {
    // await createdHistory.save();
  } catch (err) {
    const error = new HttpError("history failed, please try again.", 500);
    return next(error);
  }
  let hists = await history.find();
  res.status(201).json({ history: hists, message: "registered" });
};

exports.bookingRides = bookingRides;
exports.deleteRides = deleteRides;
exports.getRides = getRides;
