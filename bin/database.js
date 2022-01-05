/**
 * @typedef {Object} User_info
 * @property {string} name name of user
 * @property {string} surname surname of user
 * @property {string} phone phone number
 */
/** 
 * @typedef  User
 * @property {string} email unique email as username 
 * @property {string} hash hashed password
 * @property {string} salt salt for hash function
 * @property {User_info} user_info information about user
 */

 module.exports = {
    get_user_by_username: get_user_by_username,
    add_user: add_user,
    add_role_to_user: add_role_to_user
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
 * Add user to database
 * @param {User} user User obiect for add to database
 * @return {Error|number} error or user ID
 */
function add_user(user) {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 
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

