const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt WITH VALIDATIONS
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get("/", accountController.buildAccountManagement);

// Deliver Update Account View
router.get(
    "/update/:account_id",
    utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process Account Update (name, lastname, email)
router.post(
    "/update",
    accountValidate.updateAccountRules(),
    accountValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process Password Change
router.post(
    "/update-password",
    accountValidate.updatePasswordRules(),
    accountValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
)


module.exports = router;    