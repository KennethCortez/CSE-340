// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByDetailView))

router.get("/", utilities.handleErrors(invController.buildManagementView))

router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
)

// Deliver Add Classification View
router.get(
    "/new/classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Deliver Add Inventory View
router.get(
    "/new/inventory",
    utilities.handleErrors(invController.buildAddInventory)
)

// Process Add Inventory (POST)
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)

module.exports = router;