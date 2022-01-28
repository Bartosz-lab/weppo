//Poprawnie Opisane
/**
 * @typedef {Object} User_info
 * @property {String} name name of user
 * @property {String} surname surname of user
 * @property {String} phone phone number
 * @property {String} email email
 */
/** 
 * @typedef  {Object} User
 * @property {Number} id unique ID
 * @property {String} username unique username 
 * @property {String} hash hashed password
 * @property {String} salt salt for hash function
 * @property {User_info} user_info information about user
 */

/** 
 * @typedef  {Object} Product_for_basket 
 * @property {Number} id unique ID
 * @property {String} name Product name
 * @property {String} imgurl URL path to photos
 * @property {Number} price Product price
 * @property {Number} quantity quantity of product
 */
/** 
 * @typedef  {Object} Product_for_list
 * @property {Number} id unique ID
 * @property {String} name Product name
 * @property {String} imgurl URL path to photos
 * @property {Number} price Product price
 * @property {Param[]} params First 4 params of product
 */
/** 
 * @typedef  {Object} Product 
 * @property {Number} id unique ID
 * @property {Number} subcat_id Subcategory ID
 * @property {String} name Product name
 * @property {Number} price Product price
 * @property {String} desc Product description
 * @property {String} imgurl URL path to photos
 * @property {String} brand Product brand
 * @property {Param[]} params All params of product
 */
/** 
 * @typedef  {Object} Param 
 * @property {String} key Param name
 * @property {String} value Param value
 */


/** 
 * @typedef  {Object} Filter 
 * @property {Number} id Filter ID
 * @property {String} name Filter name
 * @property {Filter_type} type type of Filter
 * @property {Filter_option[]} options Avaiable options
 */
/** 
 * @typedef  {Object} Filter_option 
 * @property {String} name Option name
 * @property {String} sort_order Sort order value
 */
/**
 * @typedef {String} Filter_type
 **/
/**
 * @enum {Filter_type}
 */
const filter_type = {
    bool: 'bool',
    enum: 'enum',
    number: 'number',
    number_min: 'number-min',
    number_max: 'number-max',
    other: 'other',
}
module.exports.filter_type = filter_type;




/**
 * @typedef {Number} Role
 **/

/**
 * @enum {Role}
 */
const role = {
    Admin: 0,
    Seller: 1,
    Customer: 2
}
module.exports.role = role;
/**
 * @typedef {String} Sort
 **/

/**
 * @enum {Sort}
 */
const sort = {
    price_asc: 'price_asc',
    price_desc: 'price_desc',
    name_asc: 'name_asc',
    name_desc: 'name_desc',
}
module.exports.sort = sort;


//Do Opisania
/** 
 * @typedef  Adress Michał powinien tu dokładny opis dać jak wygląda adres
 * @property {Number} id unique ID
 * @property {String} user_id
 * @property {String} street
 * @property {String} home_number
 * @property {String} flat_number
 * itp tutaj trzeba opisać
 */
/** 
 * @typedef  Product Michał powinien tu dokładny opis dać jak wygląda produkt
 * @property {Number} id unique ID
 * @property {String} name
 * @property {Object} proporties
 * @property {String} description
 * @property {String} price
 * itp tutaj trzeba opisać
 */
/** 
 * @typedef  Orders 
 * @property {Number} id unique ID
 * itp tutaj trzeba opisać
 */