const Pool = require('../database/db_pool');
const typedef = require('../typedef'); 

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
 *  @return {{id: Number, val: String}[]} table of object with {cat_id, cat_name}
 */
async function get_categories() {
    //OK zamiast * można wybrać tylko odpowiednie kolumny (ale nie wiem co jest wydajniejsze więc twoja wola)
    // czemu robisz iterator za pomocą while zamiast użyć for of // bo lubie
    try {
        const result = await Pool.query(`SELECT * FROM categories;`);
        let categories = [];
        let i = 0;
        while (result.rows[i]) {
            categories.push({
                id: result.rows[i].id,
                val: result.rows[i].name
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
 * @return {{id: Number, cat_id: Number, val: String}[]} table of object with {subcat_id, cat_id, subcat_name}
 */
async function get_subcategories() {
    //OK zamiast * można wybrać tylko odpowiednie kolumny (ale nie wiem co jest wydajniejsze więc twoja wola)
    // czemu robisz iterator za pomocą while zamiast użyć for of
    try {
        const result = await Pool.query(`SELECT * FROM subcategories;`);
        let subcategories = [];
        let i = 0;
        while (result.rows[i]) {
            subcategories.push({
                id: result.rows[i].id,
                cat_id: result.rows[i].cat_id,
                val: result.rows[i].name
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
    //OK, ale pamiętaj o kolejności sortowania
    try {
        const result = await Pool.query(`SELECT * FROM widok9 WHERE subcat_id = $1 ORDER BY filter_id;`, [subcat_id]);
        let filter_list = [];
        var i = 0;
        while (result.rows[i]) {
            const filter_values = await Pool.query(`SELECT DISTINCT option_value FROM widok9 WHERE subcat_id = $1 AND filter_id = $2`, [subcat_id, result.rows[i].filter_id]);
            let option_list = [];
            option_list = filter_values.rows.map(item => item.option_value);
            let filter_options = [];
            for (var j = 0; j < option_list.length; j++) {
                filter_options.push({
                    name: option_list[j],
                    sort_order: "" //to be changed
                })
            }
            filter_list.push({
                id: result.rows[i].filter_id,
                name: result.rows[i].filter_name,
                type: result.rows[i].filter_type,
                options: filter_options
            })
            let filter_count = (await Pool.query(`SELECT COUNT (filter_id) FROM widok9 WHERE subcat_id = $1 AND filter_id = $2`, [subcat_id, result.rows[i].filter_id])).rows[0].count;
            i = i + parseInt(filter_count) + 1;
        }
        return (filter_list);
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_filters_by_subcategory = get_filters_by_subcategory;


/**
 * 
 * @param {Number} subcat_id Subcategory ID
 * @return {{category_id: Number, category_name: String, id: Number, name: String}} list of Filters with his options
 */
 async function get_position_of_subcategory(subcat_id) {
    try {
        const result = await Pool.query(`SELECT * FROM widok12 WHERE subcat_id = $1;`, [subcat_id]);
        if (!result.rows[0].subcat_id) throw new Error('7. Database Error');
        return { 
            category_id: result.rows[0].cat_id, 
            category_name:  result.rows[0].cat_name, 
            id: subcat_id, 
            name:  result.rows[0].subcat_name
        };
    } catch (err) {
        throw_my_error(err);
    }

}
module.exports.get_position_of_subcategory = get_position_of_subcategory;