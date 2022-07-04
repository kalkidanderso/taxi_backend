const express = require("express");
const { check } = require("express-validator");

const driversControllers = require("../controllers/drivers-controllers");

const router = express.Router();

router.get("/", driversControllers.getDriver);
router.post("/", driversControllers.registerDriver);

module.exports = router;
