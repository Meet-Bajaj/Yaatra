const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

router.post("/register", vehicleController.registerVehicle);
router.get("/:id", vehicleController.getVehicleDetails);

module.exports = router;
