const db_users = require('./db_users');
const typedef = require('../typedef');
const role = typedef.role;


//to jest do przerobienia aby każda funkcja była dodawana do export w miejscu jej definicji będzie czytelniej
 module.exports = {
    get_user_by_username: get_user_by_username,
    get_id_of_user: get_id_of_user,
    get_username_of_user: get_username_of_user,
    check_user_role: check_user_role,
    get_adresses_by_user_id: get_adresses_by_user_id,
    get_adress_by_id: get_adress_by_id,
}
Object.assign(module.exports, db_users);
//Uwaga nie wszustkie funkcje mają poprawnie opisane params i opisy tego co powinny robić.
//W folderze database znajdują się tylko funkcje który mają poprawny opis (w sensie tego co robią [jeśli uważacie że moj styl opisu ich to opiszcie ładniej zachowójąc znaczenie])

//ostatecznie w tym pliku nie powinna znaleść się zadna funkcja, ma to byćjedynie hub do połączenia róznych stron działania bazy

//każda funkcja w bazie danych powinna zawierać weryfikacje poprawności danych.

const pool = require('./db_pool');


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
 * get user roles
 * @param {number} id user id in database
 * @return {} 
 */
 async function get_user_roles(id) {
    //??
    let ret_obj = {};
    ret_obj[role.Admin] = true;
    ret_obj[role.Seller] = false;
    ret_obj[role.Customer] = false;
    
    return ret_obj;
}
module.exports.get_user_roles = get_user_roles;

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