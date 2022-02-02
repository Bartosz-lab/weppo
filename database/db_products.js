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
 * @param {(String[] | String)} brand Producer
 * @param {{id:Number, value: (String[] | String), type: typedef.Filter_type}[]} search_conds Search contitionals
 * @return {typedef.Product_for_list[]} list of products to display in list
 */
 async function get_product_by_subcategory(subcat_id, sort_by, per_page, page, min_price, max_price, brand, search_conds) {

    if (min_price === undefined) min_price = 0;
    if (max_price === undefined) max_price = 99999999;
    if (per_page === undefined) per_page = 10;
    if (page === undefined) page = 1;
    if (brand === undefined) {
        brand = (await Pool.query(`SELECT brand FROM products;`)).rows;
        brand = brand.map(item => item.brand);
    }
    
    try {
        products_filtered = [];
        pf_i = 0;
        while (search_conds[pf_i]) {
          result_filters = (await Pool.query(`SELECT product_id FROM widok7 WHERE (filter_id = $1) AND (option_value = $2)`, [search_conds[pf_i].id, search_conds[pf_i].value])).rows;
          result_filters = result_filters.map(item => item.product_id);
          if (pf_i == 0) products_filtered = result_filters;
          products_filtered = products_filtered.filter(value => result_filters.includes(value));
          pf_i++;
        }
        if (pf_i == 0) {
            products_filtered = (await Pool.query(`SELECT id FROM products;`)).rows;
            products_filtered = products_filtered.map(item => item.id);
        }

        const result = await Pool.query(`SELECT * FROM products WHERE (subcat_id = $1) AND (price BETWEEN $2 AND $3) AND (brand = ANY ($4)) AND (id = ANY ($5)) LIMIT $6 OFFSET $7;`, 
                                        [subcat_id, min_price, max_price, brand, products_filtered , per_page, (page-1) * per_page]);

        let products_list = [];
        for (let i = 0; i < result.rows.length; i++) {
            const result_params = await Pool.query(`SELECT * FROM widok7 WHERE (product_id = $1)`, [result.rows[i].id]);
            let params = [];
            let j = 0;
            while (result_params.rows[j] && j < 4) {
                params.push (
                    {
                        key : result_params.rows[j].filter_name,
                        value : result_params.rows[j].option_value
                    }
                )
                j++;
            }

            products_list.push( {
                 id : result.rows[i].id,
                 name : result.rows[i].name,
                 brand : result.rows[i].brand,
                 imgurl : result.rows[i].photo_url,
                 price : result.rows[i].price,
                 desc :  result.rows[i].descr,
                 params : params
            }
            );

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
 async function get_product_by_id(id, params_nr) {
    if (params_nr === undefined) params_nr = 999;
    try {

        const result_params = await Pool.query(`SELECT * FROM widok7 WHERE (product_id = $1)`, [id]);
        let params = [];
        let i = 0;
        while (result_params.rows[i] && i < params_nr) {
            params.push (
                {
                    key : result_params.rows[i].filter_name,
                    value : result_params.rows[i].option_value
                }
            )
            i++;
        }

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
                params : params
            }
        }
        else throw new Error('7. Database Error');
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_product_by_id = get_product_by_id;

/**
 * Add a new product
 * @param {typedef.Product} Product object
 * @return {} nothing
 */
 async function add_product (Product) {
   try {
        const result = await Pool.query(
            `INSERT INTO products (id, name, subcat_id, price, descr, brand, photo_url) VALUES 
            (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id;`,
            [Product.name, Product.subcat_id, Product.price, Product.desc, Product.brand, Product.imgurl]);
        if (!result.rows[0]) throw new Error('7. Database Error');

        let i = 0;
        while (Product.params[i]) {
          filter_name = Product.params[i].key;
          option_value = Product.params[i].value;
          const filter_option_id = await Pool.query (`SELECT option_id FROM widok11 where filter_name = $1 AND option_value = $2;`, [filter_name, option_value])
          
          if (filter_option_id.rows[0].option_id) {
            const result2 = await Pool.query (`INSERT INTO products_to_filters (product_id, filter_option_id) VALUES ($1,$2);`,[result.rows[0].id, filter_option_id.rows[0].option_id]);
          }
          i++;
        }
        return result.rows[0].id;
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.add_product = add_product;

/**
 * Update product info
 * @param {typedef.Product} product
 */
 async function update_product(Product) {
    try {
      const result = await Pool.query(`SELECT * FROM products WHERE id =$1;`, [Product.id]);
      if (result.rows[0]) {
        let query = 'UPDATE products SET';
        let params = [Product.id];
        let i = 2;
        if (typeof Product.name === 'string') {
          query += ` name=$${i++}`;
          params.push(Product.new_name);
        }
        if (typeof Product.price === 'number') {
          if (i > 2) query += ',';
          query += ` price=$${i++}`;
          params.push(Product.price);
        }
        if (typeof Product.descr === 'string') {
          if (i > 2) query += ',';
          query += ` descr=$${i++}`;
          params.push(Product.descr);
        }
        if (typeof Product.brand === 'string') {
          if (i > 2) query += ',';
          query += ` brand=$${i++}`;
          params.push(Product.brand);
        }
        if (typeof Product.photo_url === 'string') {
          if (i > 2) query += ',';
          query += ` photo_url=$${i++}`;
          params.push(Product.photo_url);
        }

        query += ' WHERE id=$1;';
        await Pool.query(query, params);
      }
    } catch {
      throw new Error('7. Database Error');
    }
  }
module.exports.update_product = update_product;

/**
 * Return 4 products of type Product for list ideally from table most reecommended products : subcat_id | product_id x 4  
 * @param {Number} subcat_id Subcategory ID
 * @param {Number} how_many nr of products to return, DEFAULT 4
 * @return {typedef.Product_for_list[]} list of products to display in list
 */
async function get_recemended_products_in_subcategory(subcat_id) {
  try {
    how_many = 4;
    let products_id = (await Pool.query(`SELECT id FROM products where subcat_id = $1 LIMIT $2;`, [subcat_id, how_many])).rows;
    products_id = products_id.map(item => item.id);

    let products_list = [];
    for (let i = 0; (i < how_many && i < products_id.length); i++) {
      let product = await get_product_by_id(products_id[i]);
      products_list.push(product);
    }

    return (products_list);
  } catch (err) {
    throw_my_error(err);
  }
}
module.exports.get_recemended_products_in_subcategory = get_recemended_products_in_subcategory;
