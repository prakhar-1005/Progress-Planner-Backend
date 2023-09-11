    const { Pool } = require('pg');

    const pool = new Pool({
        user: process.env.DATABASE,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.DBPORT
    })


    module.exports = pool