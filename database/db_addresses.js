
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
 * Get latest address by users id
 * @param {number} id address id in database
 * @return {Adress[]} 
 */
async function get_adress_by_id(id) {
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

/**
 * do zmiany
 * @param {number} id user id 
 * @return {Adress} user address
 */
 async function get_adresses_by_user_id(id) {
    //const result = await Pool.query(`SELECT * FROM addresses WHERE user_id ='${id}' DESC;`);
    return {
        street: "Krakowska",
        zipcode: "12-345",
        city: "Wroclaw"
    }
}
module.exports.get_adresses_by_user_id = get_adresses_by_user_id;