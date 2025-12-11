
const utilities = require("../utilities/")
const appointmentsModel = require("../models/appointments-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* -----------------------------------------
    Helper: Obtain logged-in user from JWT
------------------------------------------ */
function getLoggedUser(req) {
    const token = req.cookies.jwt
    if (!token) return null
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
        return null
    }
    }

    /* ****************************************
    * Render New Appointment Form
    * **************************************** */
    async function buildNewAppointmentForm(req, res) {
    const nav = await utilities.getNav()
    const user = getLoggedUser(req)

    if (!user) {
        req.flash("notice", "You must be logged in to schedule an appointment.")
        return res.redirect("/account/login")
    }

    const active = await appointmentsModel.getActiveAppointmentByAccount(user.account_id)
    if (active) {
        req.flash("notice", "You already have a scheduled appointment. Complete or cancel it first.")
        return res.redirect("/appointments")
    }

    res.render("appointments/new", {
        title: "Schedule Appointment",
        nav,
        errors: null,
        messages: req.flash("notice") || [],
    })
}


/* ****************************************
 * Create New Appointment
 * **************************************** */
async function createAppointment(req, res) {
    const nav = await utilities.getNav()
    const user = getLoggedUser(req)
    if (!user) {
        req.flash("notice", "Login required.")
        return res.redirect("/account/login")
    }

    const { vehicle_make, vehicle_model, appointment_date, appointment_time, notes } = req.body

    if (!vehicle_make || !vehicle_model || !appointment_date || !appointment_time) {
    req.flash("notice", "All fields are required.")
    return res.redirect("/appointments/new")
}

    const active = await appointmentsModel.getActiveAppointmentByAccount(user.account_id)
    if (active) {
        req.flash("notice", "You already have a pending appointment.")
        return res.redirect("/appointments")
    }

    await appointmentsModel.createAppointment(
    user.account_id,
    req.body.vehicle_make,
    req.body.vehicle_model,
    appointment_date,
    appointment_time,
    notes
)


req.flash("notice", "Appointment scheduled successfully!")
return res.redirect("/appointments")

}

/* ****************************************
 * List User Appointments
 * **************************************** */
async function listAppointments(req, res) {
    const nav = await utilities.getNav()
    const user = getLoggedUser(req)
    if (!user) return res.redirect("/account/login")

    const appointments = await appointmentsModel.getAppointmentsByAccount(user.account_id)

    res.render("appointments/view", {
        title: "My Appointments",
        nav,
        appointments,
        messages: req.flash("notice") || []
    })
}


module.exports = {
    buildNewAppointmentForm,
    createAppointment,
    listAppointments,
}
