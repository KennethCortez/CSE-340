const errorCont = {}

errorCont.causeError = async function (req, res, next) {
    // Intentionally throw an error
    throw new Error("Intentional test error for Task 3.")
}

module.exports = errorCont
