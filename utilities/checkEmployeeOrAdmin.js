const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * Check if logged user is Employee or Admin
 * **************************************** */
async function checkEmployeeOrAdmin(req, res, next) {
    const token = req.cookies.jwt

    if (!token) {
        req.flash("notice", "You must be logged in to access this page.")
        return res.redirect("/account/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Make the decoded token available for later use
        req.accountData = decoded

        // Allow only Employee or Admin
        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
            return next()
        }

        // If account_type is Client, deny access
        req.flash("notice", "You do not have permission to perform this action.")
        return res.redirect("/account/login")

    } catch (error) {
        req.flash("notice", "Invalid session. Please log in again.")
        return res.redirect("/account/login")
    }
}

module.exports = { checkEmployeeOrAdmin }
