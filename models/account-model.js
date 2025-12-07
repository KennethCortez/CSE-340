const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Admin') RETURNING *"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount > 0
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function getAccountById(account_id) {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
}

async function updateAccountInfo(account_id, firstname, lastname, email) {
    const sql = `
        UPDATE account
        SET account_firstname = $2,
            account_lastname = $3,
            account_email = $4
        WHERE account_id = $1
        RETURNING *
    `

    const result = await pool.query(sql, [
        account_id,
        firstname,
        lastname,
        email
    ])

    return result.rows[0]
}

async function updatePassword(account_id, hashedPassword) {
    const sql = `
        UPDATE account
        SET account_password = $2
        WHERE account_id = $1
        RETURNING *
    `
    const result = await pool.query(sql, [account_id, hashedPassword])
    return result.rows[0]
}


module.exports = {
    registerAccount, 
    checkExistingEmail, 
    getAccountByEmail,
    getAccountById,
    updateAccountInfo,
    updatePassword,
    
};