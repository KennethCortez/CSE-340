const { Pool } = require("pg")
require("dotenv").config()

let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ✔ KENNETH: Added SSL configuration for production deployment
    ssl: process.env.NODE_ENV === "development"
        ? { rejectUnauthorized: false }
        : false
})

const originalQuery = pool.query.bind(pool)  

pool.query = async (text, params) => {    
    try {
        const res = await originalQuery(text, params)
        console.log("executed query", { text })
        return res
    } catch (error) {
        console.error("error in query", { text })
        throw error
    }
}

module.exports = pool  
