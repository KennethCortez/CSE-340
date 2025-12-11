const express = require("express")
const router = express.Router()

const appointmentsController = require("../controllers/appointmentsController")
const utilities = require("../utilities")

// Show new appointment form
router.get(
    "/new",
    utilities.handleErrors(appointmentsController.buildNewAppointmentForm)
)

// Crate new appointment
router.post(
    "/new",
    utilities.handleErrors(appointmentsController.createAppointment)
)

// List appointments
router.get(
    "/",
    utilities.handleErrors(appointmentsController.listAppointments)
)

module.exports = router
