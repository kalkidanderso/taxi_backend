const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const Passenger = require("../models/passenger");

const getPassengersById = async (req, res, next) => {
  let passenger;
  try {
    passenger = await Passenger.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a passenger.",
      500
    );
    return next(error);
  }

  if (!passenger) {
    const error = new HttpError(
      "Could not find passenger for the provided id.",
      404
    );
    return next(error);
  }
  // console.log(passenger);
  res.json({ passenger });
};

const registerPassenger = async (req, res, next) => {
  console.log("This is printed");
  const phoneNumber = req.body.phoneNumber;

  let passenger_in_pending = false;
  let passengers = await Passenger.find();
  passengers.map((passenger) => {
    if (passenger.phoneNumber === phoneNumber) {
      console.log("Thsi is printed");
      passenger_in_pending = true;
    }
    // console.log(passengers);
  });

  if (!passenger_in_pending) {
    const createdPassenger = new Passenger({
      phoneNumber,
    });
    await createdPassenger.save();
  }

  res.status(201).json({ message: "registered" });

  // console.log(history.find());
};

exports.getPassengersById = getPassengersById;
exports.registerPassenger = registerPassenger;
