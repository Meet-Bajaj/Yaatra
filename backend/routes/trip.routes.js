const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");

router.post("/", tripController.createTrip);
router.get("/", tripController.getTrips);
router.get("/:id", tripController.getTripById);
router.put("/:id/status", tripController.updateTripStatus);

module.exports = router;
