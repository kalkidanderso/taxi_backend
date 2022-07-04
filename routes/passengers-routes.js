const express = require("express");
const { check } = require("express-validator");

const passengersControllers = require("../controllers/passengers-controllers");
const router = express.Router();

router.get("/", passengersControllers.getPassengersById);

router.post("/", passengersControllers.registerPassenger);

module.exports = router;
