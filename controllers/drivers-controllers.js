const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const Driver = require("../models/driver");

const getDriver = async (req, res, next) => {
  console.log("drivers");
  let driver;
  try {
    driver = await Driver.find();
    // console.log(driver);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a driver.",
      500
    );
    return next(error);
  }
  if (!driver) {
    const error = new HttpError("No Driver in database", 404);
    return next(error);
  }

  res.json({ driver: driver });
};

const registerDriver = async (req, res, next) => {
  console.log("Making some thing");

  const { phoneNumber } = "09912121212";

  const createdDriver = new Driver({
    phoneNumber,
  });

  try {
    await createdDriver.save();
  } catch (err) {
    const error = new HttpError(
      "driver registration failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ driver: createdDriver });
};

exports.getDriver = getDriver;
exports.registerDriver = registerDriver;
