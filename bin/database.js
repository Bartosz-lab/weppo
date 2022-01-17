/**
 * @typedef {Object} User_info
 * @property {string} name name of user
 * @property {string} surname surname of user
 * @property {string} phone phone number
 * @property {string} email email
 */
/** 
 * @typedef  User
 * @property {number} id unique ID
 * @property {string} username unique username 
 * @property {string} hash hashed password
 * @property {string} salt salt for hash function
 * @property {User_info} user_info information about user
 */
/** 
 * @typedef  Adress Michał powinien tu dokładny opis dać jak wygląda adres
 * @property {number} id unique ID
 * @property {string} user_id
 * @property {string} street
 * @property {string} home_number
 * @property {string} flat_number
 * itp tutaj trzeba opisać
 */
/** 
 * @typedef  Product Michał powinien tu dokładny opis dać jak wygląda produkt
 * @property {number} id unique ID
 * @property {string} name
 * @property {Object} proporties
 * @property {string} description
 * @property {string} price
 * itp tutaj trzeba opisać
 */

const pg = require('pg');
require('dotenv').config();


//to jest do przerobienia aby każda funkcja była dodawana do export w miejscu jej definicji będzie czytelniej
 module.exports = {
    get_user_by_username: get_user_by_username,
    get_user_by_username_for_login: get_user_by_username_for_login,
    get_id_of_user: get_id_of_user,
    get_user_info_by_id: get_user_info_by_id,
    get_username_of_user: get_username_of_user,
    add_user: add_user,
    add_role_to_user: add_role_to_user,
    check_user_role: check_user_role,
    get_adresses_by_user_id: get_adresses_by_user_id,
    get_adress_by_id: get_adress_by_id,
}
//Uwaga nie wszustkie funkcje mają poprawnie opisane params


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
 * @return {User} user object or undefined if user is not found
 */
async function get_user_by_username(name) {
    const result = await pool.query(`SELECT * FROM USERS WHERE USERNAME='${name}';`);
    if(result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}
/**
 * Finding user by username function returning only information for log in
 * @param {string} name username
 * @return {{id: string, hash: string, salt: string}} object with id hash and salt or undefined if user is not found
 */
async function get_user_by_username_for_login(name) {
    //powinna zwracać tylko odpowiednie dane patrz wyżej
    const result = await pool.query(`SELECT * FROM USERS WHERE USERNAME='${name}';`);
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
 * @return {User_info}  Returning User_info object
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
    //oraz zmiana query tak aby przetwarzała objekt user(definicja na górze pliku) na wpis w tabeli

    const result = await pool.query(`INSERT INTO USERS VALUES (DEFAULT, '${user.username}', '${user.hash}', '${user.salt}') RETURNING id;`);
    if(result.rows[0]) {
        return result.rows[0].id;
    }
    return 11;
}

/**
 * Add role to user
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {Error} error or null if role is saved correctly
 */
 async function add_role_to_user(id, role) {
    //??
    return null;
}
/**
 * Check user role
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {bool} true if user have this role
 */
 async function check_user_role(id, role) {
    //??
    return true;
}

/**
 * Do opisu
 * @param {number} id user id in database
 * @return {Adress[]} 
 */
 async function get_adresses_by_user_id(id) {

}
/**
 * Do opisu
 * @param {number} id adress id in database
 * @return {Adress[]} 
 */
 async function get_adress_by_id(id) {

}

module.exports.get_products_by_category = get_products_by_category;
async function get_products_by_category(id, number, start, type ) {
    //kategoria, ile zwrócić, od jakiego zacząć, typ sortowania
}

module.exports.get_product_by_subcategory = get_product_by_subcategory;
async function get_product_by_subcategory(id) {
    // jak wyżej
}

module.exports.get_proporties_by_subcategory = get_proporties_by_subcategory;
async function get_proporties_by_subcategory(id) {
    // zwraca objekt właściwości dla danej podkategorii
}