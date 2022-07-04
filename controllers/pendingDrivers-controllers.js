const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const pendingDrivers = require("../models/pendingDrivers");

const getPendingDrivers = async (req, res, next) => {
  let pendingDriver;
  try {
    pendingDriver = await pendingDrivers.find();
    // console.log(pendingDriver);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a pending driver.",
      500
    );
    return next(error);
  }
  if (!pendingDriver) {
    const error = new HttpError("No Driver in database", 404);
    return next(error);
  }

  res.json({ pendingDriver: pendingDriver });
};
const removePending = async (req, res, next) => {};

const addPendingDrivers = async (req, res, next) => {
  console.log("Making some thing");

  // let totalBusDriver = req.body.vehicleType === "bus" ? 1 : 0;
  // let totalVipDriver = req.body.vehicleType === "vip" ? 1 : 0;

  let pendingDriverss = await pendingDrivers.find();

  let in_the_pending = false;
  pendingDriverss.map((pen) => {
    if (pen.email === req.body.email) {
      in_the_pending = true;
    }
  });

  if (in_the_pending) {
    pendingDrivers.deleteOne({ email: req.body.email }).remove().exec();
  }
  //   console.log(req.body.vehicleType);
  const pendingDriver = new pendingDrivers({
    location: req.body.location,
    vehicleType: req.body.vehicleType,
    email: req.body.email,
  });

  try {
    await pendingDriver.save();
  } catch (err) {
    const error = new HttpError(
      "pending driver registration failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ pendingDriver: pendingDriver, message: "success" });
};

const removePendingDrivers = async (req, res, next) => {
  console.log(req.body);
  // let bus = 0;
  // let vip = 0;

  let pendingDrive = await pendingDrivers.find();

  let in_the_pending = false;
  let query = { email: req.body.email };

  pendingDrive.map((pen) => {
    if (pen.email === req.body.email) {
      in_the_pending = true;
    }
  });
  pendingDrivers.deleteOne({ query }).remove().exec();

  // if (in_the_pending) {
  //   if (req.body.vehicleType === "bus") {
  //     bus -= 1;
  //   } else if (req.body.vehicleType === "vip") {
  //     vip -= 1;
  //   }
  // }

  // let newData = {
  //   location: req.body.location,
  //   totalBusDriver: bus,
  //   totalVipDriver: vip,
  // };

  //   pendingDrive.findOneAndUpdate(
  //     query,
  //     newData,
  //     { upsert: true },
  //     function (err, doc) {
  //       if (err) return res.send(500, { error: err });
  //       //   return res.send("Succesfully saved.");
  // res.status(201).json({ pendingDrive: pendingDrive, message: "removed" });
  //     }
  //   );

  // pendingDrivers.findOneAndUpdate(query, newData, null, function (err, docs) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Original Doc : ", docs);
  //   }
  // });

  res.status(201).json({ message: "penRemoved" });
};

exports.getPendingDrivers = getPendingDrivers;
exports.addPendingDrivers = addPendingDrivers;
exports.removePendingDrivers = removePendingDrivers;
