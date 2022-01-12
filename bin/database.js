/**
 * @typedef {Object} User_info
 * @property {string} name name of user
 * @property {string} surname surname of user
 * @property {string} phone phone number
 * @property {string} email email
 */
/** 
 * @typedef  User
 * @property {string} id unique ID
 * @property {string} email unique email as username 
 * @property {string} hash hashed password
 * @property {string} salt salt for hash function
 * @property {User_info} user_info information about user
 */

const pg = require('pg');
require('dotenv').config();

 module.exports = {
    get_user_by_username: get_user_by_username,
    get_id_of_user: get_id_of_user,
    get_user_info_by_id: get_user_info_by_id,
    get_username_of_user: get_username_of_user,
    add_user: add_user,
    add_role_to_user: add_role_to_user,
    check_user_role: check_user_role
}


// dummy database

var users = {};
console.log(process.env.DATABASE_URL);

const pool = new pg.Pool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port_bd,
    ssl: { rejectUnauthorized: false }
});

/**
 * Finding user by username function
 * @param {string} name username
 * @return {{name: string, pass: string, salt: string}} user object or undefined if user is not found
 */
async function get_user_by_username(name) {
    const result = await pool.query(`SELECT * FROM USERS WHERE EMAIL='${name}';`);
    if(result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}
/**
 * Finding user by id function
 * @param {number} id user ID
 * @return {{name: string, pass: string, salt: string}} user object or undefined if user is not found
 */
 async function get_user_by_id(name) {
    const result = await pool.query(`SELECT * FROM USERS WHERE ID='${id}';`);
    if(result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}
/**
 * Finding user info by id function
 * @param {number} id user ID
 * @return {user_info}  OK
 */
 async function get_user_info_by_id(id) {
    // const result = await pool.query(`SELECT * FROM USERS WHERE ID='${id}';`);
    // if(result.rows[0]) {
    //     return result.rows[0];
    // }
    return {
        name: "Jan", 
        surname: "Kowalski", 
        tel: "123456789",
        email: "jkowalski@gmail.com"
    };
}
/**
 * Finding user id by username function
 * @param {string} name username
 * @return {number | null} user id or null if user is not found
 */
 function get_id_of_user(name) {
    return 11;
}
/**
 * Finding username by id function
 * @param {number} id ID
 * @return {string | null} username or null if user is not found
 */
 function get_username_of_user(id) {
    return "tj";
}

/**
 * Add user to database
 * @param {User} user User obiect for add to database
 * @return {Error|number} error or user ID
 */
async function add_user(user) {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 

    const result = await pool.query(`INSERT INTO USERS VALUES (DEFAULT, '${user.email}', '${user.hash}', '${user.salt}') RETURNING id;`);
    if(result.rows[0]) {
        return result.rows[0].id;
    }


    user.id = 11;
    users[user.email] = user;
    //console.log(users);
    return 11;
}

/**
 * Add role to user
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {Error} error or null if role is saved correctly
 */
 function add_role_to_user(id, role) {
    //??
    return null;
}
/**
 * Check user role
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {bool} true if user have this role
 */
 function check_user_role(id, role) {
    //??
    return true;
}

