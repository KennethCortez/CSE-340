
const pool = require("../database")

/**
 * Create a new appointment
 */
async function createAppointment(account_id, vehicle_make, vehicle_model, appointment_date, appointment_time, notes) {
    const client = await pool.connect()
    try {
        const sql = `
            INSERT INTO public.appointments
            (account_id, vehicle_make, vehicle_model, appointment_date, appointment_time, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `
        const values = [
            account_id,
            vehicle_make || null,
            vehicle_model || null,
            appointment_date,
            appointment_time,
            notes || null
        ]

        const result = await client.query(sql, values)
        return result.rows[0]

    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}


/**
 * obtain the active appointment(status = 'scheduled')
 */
async function getActiveAppointmentByAccount(account_id) {
    const sql = `SELECT * FROM public.appointments
                WHERE account_id = $1 AND status = 'scheduled'
                ORDER BY created_at DESC
                LIMIT 1;`
    const values = [account_id]
    const result = await pool.query(sql, values)
    return result.rows[0] || null
}

/**
 * Obtain appintments history by account
 */
async function getAppointmentsByAccount(account_id) {
    const sql = `SELECT *
                FROM public.appointments
                WHERE account_id = $1
                ORDER BY appointment_date DESC, appointment_time DESC;`
    const values = [account_id]
    const result = await pool.query(sql, values)
    return result.rows
}


/**
 * Obtain appointments by car item
 */
async function getAppointmentsByInventory(inv_id) {
    const sql = `SELECT a.*, acc.account_firstname, acc.account_lastname, acc.account_email
                FROM public.appointments a
                JOIN public.account acc ON a.account_id = acc.account_id
                WHERE a.inv_id = $1
                ORDER BY a.appointment_date DESC, a.appointment_time DESC;`
    const values = [inv_id]
    const result = await pool.query(sql, values)
    return result.rows
}

/**
 * Change appointment status
 */
async function updateAppointmentStatus(appointment_id, status) {
    const sql = `UPDATE public.appointments
                SET status = $1, updated_at = NOW()
                WHERE appointment_id = $2
                RETURNING *;`
    const values = [status, appointment_id]
    const result = await pool.query(sql, values)
    return result.rows[0]
}

module.exports = {
    createAppointment,
    getActiveAppointmentByAccount,
    getAppointmentsByAccount,
    getAppointmentsByInventory,
    updateAppointmentStatus,
}
