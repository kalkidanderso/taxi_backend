const express = require("express");
const { check } = require("express-validator");

const ridesControllers = require("../controllers/rides-controllers");

const router = express.Router();

// router.get("/", passengersControllers.getPassengersById);

router.get("/", ridesControllers.getRides);
router.post("/", ridesControllers.bookingRides);
router.delete("/", ridesControllers.deleteRides);

module.exports = router;
