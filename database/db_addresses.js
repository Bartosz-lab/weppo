const { text } = require('body-parser');
const { max } = require('pg/lib/defaults');
const Pool = require('../database/db_pool');
const typedef = require('../typedef');
const role = typedef.role;


/**
 * Throwing errors 
 * @param {Error} err error
 */
 function throw_my_error(err) {
    if(+err.message[0] >= 0 && +err.message[0] <= 10){
      throw err;
    } else {
      throw new Error('7. Database Error');
    }
}

/**
 * Get latest address by address id
 * @param {number} id address id in database
 * @return {Address} 
 */
async function get_address_by_id(id) {
    try {
        const result = await Pool.query(`SELECT * FROM addresses WHERE id = $1 ORDER BY id DESC;`, [id]);
        if (result.rows[0]) {
            return {
                id: id,
                user_id: result.rows[0].user_id,
                street: result.rows[0].street,
                nr_house: result.rows[0].nr_house,
                nr_flat: result.rows[0].nr_flat,
                zip_code: result.rows[0].zip_code,
                city: result.rows[0].city,
                country: result.rows[0].country
            }
        }
        else throw new Error('7. Database Error');
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_address_by_id = get_address_by_id;


/**
 * Get latest address of user by user id
 * @param {number} id user id 
 * @return {Address} users address
 */
 async function get_adress_by_user_id(user_id) {
     //OK
    try {
        const result = await Pool.query(`SELECT * FROM addresses WHERE user_id = $1 ORDER BY id DESC;`, [user_id]);
        if (result.rows[0]) {
            return {
                id: result.rows[0].id,
                user_id: user_id,
                street: result.rows[0].street,
                nr_house: result.rows[0].nr_house,
                nr_flat: result.rows[0].nr_flat,
                zip_code: result.rows[0].zip_code,
                city: result.rows[0].city,
                country: result.rows[0].country
            }
        }
        else {
            return {
                id: '',
                user_id: user_id,
                street: '',
                nr_house: '',
                nr_flat: '',
                zip_code: '',
                city: '',
                country: ''
             }
        }
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_adress_by_user_id = get_adress_by_user_id;

/**
 * Save users address
 * @param {Address} users_address
 * @return 
 */
async function save_user_adress(user_id, street, nr_house, nr_flat, zip_code, city, country) {
    console.log("SET ADRESS NOT IMPLEMENTED");
    console.log(`Data: id: ${user_id} st: ${street} nr h: ${nr_house} nr f: ${nr_flat} zip: ${zip_code} city: ${city} counry: ${country}`);
}

module.exports.save_user_adress = save_user_adress;
