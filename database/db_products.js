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
 * Get list of products
 * @param {Number} id Subcategory ID
 * @param {typedef.Sort} sort_by Sortig type
 * @param {Number} per_page number of returning products
 * @param {Number} page current page 
 * @param {Number} min_price Minimal Price
 * @param {Number} max_price Maximal Price
 * @param {(String[] | String)} producer Producer
 * @param {{id:Number, value: (String[] | String), type: typedef.Filter_type}[]} search_conds Search contitionals
 * @return {typedef.Product_for_list[]} list of products to display in list
 */
 async function get_product_by_subcategory(id, sort_by, per_page, page, min_price, max_price, producer, search_conds) {
    // funkcja pobiera id kategorii i wyszukuje w niej określoną liczbę produktów (per_page) 
    // uprzednio je sortując w odpowiednim typie i zwraca produkty na określoną stronę tzn.
    // page = 1 zwraca produkty 1-> per_page (zakładam liczenie od 1)
    // page = 2 zwraca produkty per_page+1-> 2*per_page (zakładam liczenie od 1)
    // search conds to (id_filtra , jaka_ma_miec_wartosc)
    if (min_price === undefined) min_price = 0;
    if (max_price === undefined) max_price = 99999999;
    if (per_page === undefined) per_page = 10;
    if (page === undefined) page = 0;
    if (brand === undefined) {
        brand = (await Pool.query(`SELECT brand FROM products;`)).rows;
        brand = brand.map(item => item.brand);
    }
    try {
        //const result = await Pool.query(`SELECT * FROM products WHERE (subcat_id = $1) AND (price BETWEEN $2 AND $3) AND (brand = ANY ($4)) AND id IN (SELECT product_id FROM widok4 WHERE filter_id = $5 AND filter_option = $6) LIMIT $7 OFFSET $8;`, 
      //                                  [subcat_id, min_price, max_price, brand, search_conds_filter_id,search_conds_filter_option, per_page, page * per_page]);
         const result = await Pool.query(`SELECT * FROM products WHERE (subcat_id = $1)`, [subcat_id]);
        let products_list = [];
        for (let i = 0; i < result.rows.length; i++) {
            products_list.push({
                id : result.rows[i].id,
                name : result.rows[i].name,
                imgurl : result.rows[i].photo_url,
                price : result.rows[i].price
            });
        }
        return (products_list);
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_product_by_subcategory = get_product_by_subcategory;

/**
 * Get product
 * @param {Number} id Product ID
 * @return {typedef.Product} Product object
 */
 async function get_product_by_id(id) {

    try {
        const result = await Pool.query(`SELECT * FROM products WHERE (id = $1)`, [id]);
        if (result.rows[0]) {
            return {
                id : id,
                subcat_id : result.rows[0].subcat_id,
                name : result.rows[0].name,
                price : result.rows[0].price,
                desc : result.rows[0].descr,
                imgurl : result.rows[0].photo_url,
                brand : result.rows[0].brand,
                params : undefined
            }
        }
        else throw new Error('7. Database Error');
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_product_by_id = get_product_by_id;