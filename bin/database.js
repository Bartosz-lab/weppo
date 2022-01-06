/**
 * @typedef {Object} User_info
 * @property {string} name name of user
 * @property {string} surname surname of user
 * @property {string} phone phone number
 */
/** 
 * @typedef  User
 * @property {string} id unique ID
 * @property {string} email unique email as username 
 * @property {string} hash hashed password
 * @property {string} salt salt for hash function
 * @property {User_info} user_info information about user
 */

 module.exports = {
    get_user_by_username: get_user_by_username,
    get_id_of_user: get_id_of_user,
    add_user: add_user,
    add_role_to_user: add_role_to_user,
    check_user_role: check_user_role
}


// dummy database

var users = {};




/**
 * Finding user by username function
 * @param {string} name username
 * @return {{name: string, pass: string, salt: string}} user object or null if user is not found
 */
function get_user_by_username(name) {
    return users[name];
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
 * Add user to database
 * @param {User} user User obiect for add to database
 * @return {Error|number} error or user ID
 */
function add_user(user) {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 
    user.id = 11;
    users[user.email] = user;
    console.log(users);
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

