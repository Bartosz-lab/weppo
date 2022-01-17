//Poprawnie Opisane
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
 * @typedef {number} Role
 **/

/**
 * @enum {Role}
 */
const role = {
    Admin: 0,
    Seller: 1,
    Customer: 2
}
module.exports = role;


//Do Opisania
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
/** 
 * @typedef  Orders 
 * @property {number} id unique ID
 * itp tutaj trzeba opisać
 */