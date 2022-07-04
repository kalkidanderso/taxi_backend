const express = require("express");
const { check } = require("express-validator");

const pendingDriversControllers = require("../controllers/pendingDrivers-controllers");

const router = express.Router();

router.get("/", pendingDriversControllers.getPendingDrivers);
router.post("/", pendingDriversControllers.addPendingDrivers);
router.post("/removeSignal", pendingDriversControllers.removePendingDrivers);

module.exports = router;
