const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}



/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByDetailView = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleById(inv_id)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`
    const detail = await utilities.buildDetailView(data)

    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detail,
        errors: null,
    })
}

/* ***************************
 *  Deliver Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    
    const classificationList = await utilities.buildClassificationList()

    res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash("notice"),
    errors: null,
    classificationList
    })
}

/* ***************************
 *  Deliver Add New Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()

    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        message: null
    })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body

    const result = await invModel.addNewClassification(classification_name)

    if (result) {

        req.flash("notice", `${classification_name} was added correctly.`)

        return res.redirect("/inv")
    } 
    else {

        req.flash("notice", "We are sorry, it was not possible to add the new classification.")

        let nav = await utilities.getNav()

        return res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            message: req.flash("notice")
        })
    }
}

/* ***************************
 *  Deliver Add New Inventory View (GET)
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
let nav = await utilities.getNav()
// Build classification select list (utilities.buildClassificationList must return a <select> string)
const classificationList = await utilities.buildClassificationList()

res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    message: null,
    // default sticky values
    classification_id: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png"
})
}

/* ***************************
*  Process Add Inventory (POST)
* ************************** */
invCont.addInventory = async function (req, res, next) {
const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail
} = req.body

// call model to insert
const result = await invModel.addNewVehicle({
    classification_id: parseInt(classification_id),
    inv_make,
    inv_model,
    inv_year: parseInt(inv_year),
    inv_description,
    inv_price: parseFloat(inv_price),
    inv_miles: inv_miles ? Number(inv_miles) : null,
    inv_color,
    inv_image,
    inv_thumbnail
})

if (result) {
    // success: rebuild nav and render management with success message
    req.flash("notice", `${inv_make} ${inv_model} was added successfully.`)
    const nav = await utilities.getNav()
    const message = req.flash("notice") // get it once
    return res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message
    })
} else {
    // failure: rebuild classification list and re-render add-inventory with sticky values
    req.flash("notice", "Sorry, the new vehicle could not be added.")
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    const message = req.flash("notice")
    return res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    message,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail
    })
}
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
        res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
})
}

/* ***************************
*  UPDATE Process Edit Inventory (POST)
* ************************** */
invCont.updateInventory = async function (req, res, next) {
let nav = await utilities.getNav()
const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail
} = req.body

// call model to insert
const updateResult = await invModel.updateInventory({
    inv_id,
    classification_id: parseInt(classification_id),
    inv_make,
    inv_model,
    inv_year: parseInt(inv_year),
    inv_description,
    inv_price: parseFloat(inv_price),
    inv_miles: inv_miles ? Number(inv_miles) : null,
    inv_color,
    inv_image,
    inv_thumbnail
})

if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
} else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect, // presta atencion kenneth
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
}
}

module.exports = invCont