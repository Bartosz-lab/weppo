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

/**
 *  Get all subcategories of products
 * @return {{Number,Number, String}[]} table of object with {subcat_id, cat_id, subcat_name}
 */
 async function get_subcategories() {
    try {
        const result = await Pool.query(`SELECT * FROM subcategories;`);
        let subcategories = [];
        let i = 0;
        while (result.rows[i]) {
            subcategories.push ({
                id : result.rows[i].id,
                cat_id : result.rows[i].cat_id,
                val : result.rows[i].name
            })
            i++;
        }
        subcategories.sort((a, b) => (a.cat_id > b.cat_id) ? 1 : ((a.cat_id == b.cat_id) ? ((a.id > b.id) ? 1 : -1) : -1));
        return (subcategories);
    } catch (err) {
    throw_my_error(err);
    }
}
module.exports.get_subcategories = get_subcategories;


/**
 * Get list of filters for subcategory by its id
 * @param {Number} subcat_id Subcategory ID
 * @return {typedef.Filter[]} list of Filters with his options
 */
async function get_filters_by_subcategory(subcat_id) {
    try {
        const result = await Pool.query(`SELECT * FROM widok8 WHERE subcat_id = $1 ORDER BY filter_id;`, [subcat_id]);
        let filter_list = [];
        var i = 0;
        while (result.rows[i]) {
            const filter_values  = await Pool.query(`SELECT DISTINCT option_value FROM widok8 WHERE subcat_id = $1 AND filter_id = $2`, [subcat_id, result.rows[i].filter_id]);
            let option_list = [];
            option_list = filter_values.rows.map(item => item.option_value);
            filter_list.push ({
                id : result.rows[i].filter_id,
                name : result.rows[i].filter_name,
                type : typedef.filter_type.number, // to be changed
                options : option_list
            })
            let filter_count  = (await Pool.query(`SELECT COUNT (filter_id) FROM widok8 WHERE subcat_id = $1 AND filter_id = $2`, [subcat_id, result.rows[i].filter_id])).rows[0].count;
            i = i + parseInt(filter_count) + 1;
        }
        return (filter_list);
    } catch (err) {
    throw_my_error(err);
    }
}
module.exports.get_filters_by_subcategory = get_filters_by_subcategory;