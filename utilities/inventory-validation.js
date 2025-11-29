const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}


// ***** RULES to add a new classification *****
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("please add a name for the new classification.")
        .isAlpha("en-US", { ignore: " " })
        .withMessage("The name of the classification must contain only letters and spaces.")
    ]
}


// ***** CHECK DATA to management errors *****
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: errors.array(),
        classification_name
        })
    }

    next()
}

/* ****************************************
 *  RULES for add-inventory
 * **************************************** */
validate.inventoryRules = () => {
return [
    body("classification_id")
    .trim()
    .notEmpty()
    .withMessage("Please choose a classification.")
    .isInt({ gt: 0 })
    .withMessage("Invalid classification selection."),

    body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Please enter the vehicle make.")
    .isLength({ max: 100 })
    .withMessage("Make is too long."),

    body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Please enter the vehicle model.")
    .isLength({ max: 100 })
    .withMessage("Model is too long."),

    body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Please enter the vehicle year.")
    .isInt({ min: 1886, max: 2100 })
    .withMessage("Please enter a valid year."),

    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Please enter a description.")
    .isLength({ max: 2000 })
    .withMessage("Description is too long."),

    body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Please enter a price.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

    body("inv_miles")
    .optional({ checkFalsy: true })
    .trim()
    .isNumeric()
    .withMessage("Miles must be numeric."),

    body("inv_color")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Color is too long."),

    body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Please provide a path for the image.")
    .isLength({ max: 255 })
    .withMessage("Image path is too long."),

    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Please provide a path for the thumbnail.")
    .isLength({ max: 255 })
    .withMessage("Thumbnail path is too long.")
]
}

/* ****************************************
*  CHECK DATA for add-inventory
*  Re-render add-inventory view with stickiness on error
* **************************************** */
validate.checkInventoryData = async (req, res, next) => {
let {
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

const errors = validationResult(req)
if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // rebuild classification select (selected option will be set by the utility)
    const classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: errors.array(),
    message: null,
    // stickiness values
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
next()
}


module.exports = validate
