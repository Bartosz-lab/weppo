const pg = require('pg');
require('dotenv').config();

module.exports = new pg.Pool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port_bd,
    ssl: { rejectUnauthorized: false }
});