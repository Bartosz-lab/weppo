const Pool = require('../database/db_pool');
const throw_my_error = require('../database/throw_error');
const typedef = require('../typedef');

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
  if (min_price === undefined || min_price == "") min_price = 0;
  if (max_price === undefined || max_price == "") max_price = 99999999;
  if (per_page === undefined) per_page = 10;
  if (page === undefined) page = 1;
  if (brand === undefined || brand == "") brand = ' IS NOT NULL';
  else brand = "= " + "'"  + brand + "'"; 

  if (sort_by == typedef.sort.price_asc) sort_by = ' ORDER BY price ASC';
  else if (sort_by == typedef.sort.price_desc) sort_by = ' ORDER BY price DESC';
  else if (sort_by == typedef.sort.name_asc) sort_by = ' ORDER BY name ASC';
  else if (sort_by == typedef.sort.name_desc) sort_by = ' ORDER BY name DESC';
  else sort_by = '';

  let products_list = [];
  let products_filtered = [];
  let pf_i = 0;
  while (search_conds[pf_i]) {
    if (search_conds[pf_i].type = typedef.filter_type.number_min) {
      min = search_conds[pf_i].value;
      max = search_conds[pf_i + 1].value;
      if (max === undefined || max == "") max = 999999;
      var result_filters = (await Pool.query(`SELECT product_id FROM widok7 WHERE (filter_id = $1) AND (option_value BETWEEN $2 AND $3);`, [search_conds[pf_i].id, min, max])).rows;
      result_filters = result_filters.map(item => item.product_id);
      if (pf_i == 0) products_filtered = result_filters;
      pf_i++;
    }
    else {
      var result_filters = (await Pool.query(`SELECT product_id FROM widok7 WHERE (filter_id = $1) AND (option_value = $2);`, [search_conds[pf_i].id, search_conds[pf_i].value])).rows;
      result_filters = result_filters.map(item => item.product_id);
      if (pf_i == 0) products_filtered = result_filters;
      products_filtered = products_filtered.filter(value => result_filters.includes(value));
    }
    pf_i++;
  }

  if (pf_i == 0) {
    products_filtered = (await Pool.query(`SELECT id FROM products;`)).rows;
    products_filtered = products_filtered.map(item => item.id);
  }


  const result = await Pool.query(`SELECT * FROM products WHERE (subcat_id = $1) AND (price BETWEEN $2 AND $3) AND brand IN (SELECT brand from products WHERE brand ${brand}) AND (id = ANY ($4)) ${sort_by} LIMIT $5 OFFSET $6;`,
      [subcat_id, min_price, max_price, products_filtered, per_page,(page - 1) * per_page] );

    for (let i = 0; i < result.rows.length; i++) {
      const result_params = await Pool.query(`SELECT * FROM widok7 WHERE (product_id = $1);`, [result.rows[i].id]);
      let params = [];
      let j = 0;
      while (result_params.rows[j] && j < 4) {
        params.push(
          {
            key : result_params.rows[j].filter_name,
            value: result_params.rows[j].option_value
          }
        )
        j++;
      }

      products_list.push({
        id: result.rows[i].id,
        name: result.rows[i].name,
        brand: result.rows[i].brand,
        imgurl: result.rows[i].photo_url,
        price: result.rows[i].price,
        desc: result.rows[i].descr,
        params: params
      }
      );
    }
    return (products_list);
}
module.exports.get_product_by_subcategory = get_product_by_subcategory;

/*
 * Get product
 * @param {Number} id Product ID
 * @return {typedef.Product} Product object
 */
async function get_product_by_id(id, params_nr) {
  //OK
  try {
    if (params_nr === undefined) params_nr = 999;
    const result_params = await Pool.query(`SELECT * FROM widok7 WHERE (product_id = $1)`, [id]);
    let params = [];
    let i = 0;
    while (result_params.rows[i] && i < params_nr) {
      params.push(
        {
          id: result_params.rows[i].filter_name,
          value: result_params.rows[i].option_value
        }
      )
      i++;
    }

    const result = await Pool.query(`SELECT * FROM products WHERE (id = $1)`, [id]);
    if (result.rows[0]) {
      return {
        id: id,
        subcat_id: result.rows[0].subcat_id,
        name: result.rows[0].name,
        price: result.rows[0].price,
        desc: result.rows[0].descr,
        imgurl: result.rows[0].photo_url,
        brand: result.rows[0].brand,
        params: params
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
 * @returns {Number} Product ID
 */
async function add_product(Product) {
  //OK
  try {
    const result = await Pool.query(
      `INSERT INTO products (id, name, subcat_id, price, descr, brand, photo_url) VALUES 
            (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id;`,
      [Product.name, Product.subcat_id, Product.price, Product.desc, Product.brand, Product.imgurl]);
    if (!result.rows[0]) throw new Error('7. Database Error');

    for (let param of Product.params) {
      const param_result = await Pool.query(`SELECT option_id FROM widok11 where filter_id = $1 AND option_value = $2;`, [param.id, param.value])
      let filter_option_id = (param_result.rows[0]) ? param_result.rows[0].option_id : undefined;
      if (!filter_option_id) {
        filter_option_id = await Pool.query (`INSERT INTO filters_options (filter_id, option_value) VALUES ($1, $2) RETURNING id;`, [param.id, param.value]);
        filter_option_id = filter_option_id.rows[0].id;
      }
      const result2 = await Pool.query (`INSERT INTO products_to_filters (product_id, filter_option_id) VALUES ($1, $2);`, [result.rows[0].id, filter_option_id]);
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
    const test = await Pool.query(`SELECT * FROM products WHERE id = $1;`, [Product.id]);
    if (test.rows[0]) {

      const result = await Pool.query(
        `UPDATE products SET name = $1, subcat_id = $2, price = $3, descr = $4, brand = $5, photo_url = $6 WHERE id = $7 RETURNING id;`,
        [Product.name, Product.subcat_id, Product.price, Product.desc, Product.brand, Product.imgurl, Product.id]);

      if (!result.rows[0]) throw new Error('7. Database Error');

      for (let param of Product.params) {
        const product_has_this_filter = await Pool.query(`SELECT * FROM widok9 WHERE (product_id = $1) AND (filter_id = $2);`, [test.rows[0].id, param.id]);
        const product_has_this_filter_and_option = await Pool.query(`SELECT * FROM widok9 WHERE (product_id = $1) AND (filter_id = $2) AND (option_value = $3);`, [test.rows[0].id, param.id, param.value]);
        if (product_has_this_filter_and_option.rows[0]) continue;
        if (product_has_this_filter.rows[0] && param.value == undefined) {
          const remove_filter_from_product = await Pool.query(`DELETE FROM products_to_filters WHERE product_id = $1 AND filter_option_id = $2;`, [test.rows[0].id, product_has_this_filter.rows[0].filter_option]);
          continue;
        }
        const param_result = await Pool.query(`SELECT * FROM widok11 WHERE filter_id = $1 AND option_value = $2;`, [param.id, param.value]);
        if (!param_result.rows[0]) {
          filter_option_id = await Pool.query (`INSERT INTO filters_options (filter_id, option_value) VALUES ($1, $2) RETURNING id;`, [param.id, param.value]);
          filter_option_id = filter_option_id.rows[0].id;
        }
        else filter_option_id = param_result.rows[0].option_id;

        if (product_has_this_filter.rows[0]) {
          const update_product_with_existing_option =  await Pool.query(`UPDATE products_to_filters SET filter_option_id = $1 WHERE (product_id = $2 AND filter_option_id = $3);`, [filter_option_id, test.rows[0].id, product_has_this_filter.rows[0].filter_option]);
          continue;
        }
        const result2 = await Pool.query (`INSERT INTO products_to_filters (product_id, filter_option_id) VALUES ($1, $2);`, [result.rows[0].id, filter_option_id]);
      }
        return result.rows[0].id;
      }
    else throw new Error('7. Database Error');
  } catch (err) {
    console.log (err.message);
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
  //OK
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

/**
 * Delete a product by his id 
 * @param {Number} prod_id Products id
 */
async function del_product(prod_id) {
  //OK
  try {
    await Pool.query('DELETE FROM products_to_filters WHERE product_id = $1;', [prod_id]);
    const result = await Pool.query('DELETE FROM products WHERE id = $1 RETURNING id;', [prod_id]);
    if (!result.rows[0].id) throw new Error('7. Database Error');
  } catch (err) {
    throw_my_error(err);
  }
}
module.exports.del_product = del_product;

/**
 * Get product for a basket by products id
 * @param {Number} id product ID
 * @return {typedef.Product_for_basket} 
 */
 async function get_product_to_basket(prod_id) {
    try {
      const result = await Pool.query('SELECT * FROM products WHERE id = $1;', [prod_id]);
      if (result.rows[0]) {
        return ({
          id : result.rows[0].id, 
          name : result.rows[0].name, 
          imgurl : result.rows[0].photo_url, 
          price : result.rows[0].price, 
          quantity : 1
        })
      }
      else throw new Error('7. Database Error');
    } catch (err) {
      throw_my_error(err);
    }

}
module.exports.get_product_to_basket = get_product_to_basket;


/**
 * Find products in search bar
 *  @param {String} search input in search bar
 * @param {sort} sort_by type
 * @param {Number} per_page
 * @param {Number} page_nr
 * @param {Number} price_min 
 * @param {Number} price_max
 * @param {String} brands
 * @return {typedef.Product_for_list[]} list of products to display in list
 * 
 */
 async function find_products(search, sort_by, per_page, page, price_min, price_max, brands) {
   // po co mi brands?
  // if (brand === undefined || brand == "") brand = ' IS NOT NULL';
  // else brand = "= " + "'"  + brand + "'"; 
  search_array = [search];
  if (sort_by == typedef.sort.price_asc) sort_by = ' ORDER BY price ASC';
  else if (sort_by == typedef.sort.price_desc) sort_by = ' ORDER BY price DESC';
  else if (sort_by == typedef.sort.name_asc) sort_by = ' ORDER BY name ASC';
  else if (sort_by == typedef.sort.name_desc) sort_by = ' ORDER BY name DESC';
  else sort_by = '';

    try {
    const result = await Pool.query(`SELECT * FROM products WHERE ((name LIKE '%' || $1 || '%')  OR  (brand LIKE '%' || $2 || '%') ) AND (price BETWEEN $3 AND $4) ${sort_by} LIMIT $5 OFFSET $6 ;`,
    [search, search, price_min, price_max, per_page,(page - 1) * per_page ] );

    let products_list = [];
    for (let i = 0; i < result.rows.length; i++) {
      const result_params = await Pool.query(`SELECT * FROM widok7 WHERE (product_id = $1);`, [result.rows[i].id]);
      let params = [];
      let j = 0;
      while (result_params.rows[j] && j < 4) {
        params.push(
          {
            key : result_params.rows[j].filter_name,
            value: result_params.rows[j].option_value
          }
        )
        j++;
      }

      products_list.push({
        id: result.rows[i].id,
        name: result.rows[i].name,
        brand: result.rows[i].brand,
        imgurl: result.rows[i].photo_url,
        price: result.rows[i].price,
        desc: result.rows[i].descr,
        params: params
      }
      );
    }
    return (products_list);
   } catch (err) {
    throw_my_error(err);
  }


}

module.exports.find_products = find_products;

/**
 * Find products price by his id
 * @param {Number} id product ID
 * @return {Number} Products price
 */
 async function get_product_price(prod_id) {
  try {
    const result = await Pool.query('SELECT * FROM products WHERE id = $1;', [prod_id]);
    if (result.rows[0]) {
      return (result.rows[0].price);
    }
    else throw new Error('7. Database Error');
  } catch (err) {
    throw_my_error(err);
  }
}
module.exports.get_product_price = get_product_price;