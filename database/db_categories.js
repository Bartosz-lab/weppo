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
 *  Get all categories of products
 *  @return {{Number,String}[]} table of object with {cat_id, cat_name}
 */
 async function get_categories() {
    try {
        const result = await Pool.query(`SELECT * FROM categories;`);
        let categories = [];
        let i = 0;
        while (result.rows[i]) {
            categories.push ({
                id : result.rows[i].id,
                val : result.rows[i].name
            })
            i++;
        }
        return (categories);
    } catch (err) {
    throw_my_error(err);
    }
}
module.exports.get_categories = get_categories;