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

router.get("/", 
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildManagementView)
)

router.post(
    "/add-classification",
    utilities.checkEmployeeOrAdmin,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
)

// Deliver Add Classification View
router.get(
    "/new/classification",
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildAddClassification)
)

// Deliver Add Inventory View
router.get(
    "/new/inventory",
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildAddInventory)
)

// Process Add Inventory (POST)
router.post(
    "/add-inventory",
    utilities.checkEmployeeOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver the edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.editInventoryView)
)
// Process the edit inventory form (POST)
router.post(
    "/edit-inventory",
    utilities.checkEmployeeOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)


module.exports = router;