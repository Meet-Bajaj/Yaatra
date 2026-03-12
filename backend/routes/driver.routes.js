const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");

router.get("/profile", driverController.getDriverProfile);
router.put("/location", driverController.updateLocation);
router.put("/status", driverController.updateStatus);

module.exports = router;
