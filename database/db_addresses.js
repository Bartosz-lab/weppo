const Pool = require('../database/db_pool');
const throw_my_error = require('../database/throw_error');
const typedef = require('../typedef');

/**
 * Get latest address of user by user id
 * @param {Number} id user id 
 * @return {typedef.Address} users address
 */
async function get_adress_by_user_id(user_id) {
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
 * @param {Number} user_id ID of user
 * @param {String} street Street
 * @param {Number} nr_house House number
 * @param {Number} nr_flat Flat number
 * @param {String} zip_code Zip Code
 * @param {String} city City
 * @param {String} country Country
 */
async function save_user_adress(user_id, street, nr_house, nr_flat, zip_code, city, country) {
    try {
        const result = await Pool.query(`SELECT * FROM addresses WHERE user_id = $1;`, [user_id]);
        if (result.rows[0]) {
            await Pool.query(`UPDATE addresses SET street = $1, nr_house = $2, nr_flat = $3, zip_code = $4, city = $5, country = $6 WHERE user_id = $7;`, [street, +nr_house, +nr_flat, zip_code, city, country, user_id]);
        } else {
            await Pool.query(`INSERT INTO addresses (id, user_id, street, nr_house, nr_flat, zip_code, city, country) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7);`, [user_id, street, +nr_house, +nr_flat, zip_code, city, country]);
        }
    }
    catch (err) {
        throw_my_error(err);
    }
}
module.exports.save_user_adress = save_user_adress;