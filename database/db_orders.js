const { continueSession } = require('pg/lib/sasl');
const Pool = require('../database/db_pool');
const throw_my_error = require('../database/throw_error');
const typedef = require('../typedef');
const Role = typedef.role;
const db_users = require('../database/db_users');
const db_addresses = require('../database/db_addresses');

/**
 * Add a new order 
 * @param {Order} order
 */
async function add_order(order) {

    try {
        const result1 = await Pool.query(`INSERT INTO addresses (user_id, street, nr_house, nr_flat, zip_code, city, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING  id;`,
            [order.user_id, order.Address.street, order.Address.nr_house, order.Address.nr_flat, order.Address.zip_code, order.Address.city, order.Address.country]);

        const result2 = await Pool.query(`INSERT INTO all_orders (user_id, address_id, status, date_of_purchase) VALUES
    ($1, $2, $3, $4) RETURNING id;`, [order.user_id, result1.rows[0].id, order.Order_status, order.date]);

        for (const prod_in_order of order.products) {
            const result3 = await Pool.query(`INSERT INTO this_order (order_id, product_id, quantity, price_when_bought) VALUES
        ($1, $2, $3, $4);`, [result2.rows[0].id, prod_in_order.id, prod_in_order.quantity, prod_in_order.price]);
        }
        return;
    }

    catch (err) {
        throw_my_error(err);
    }
}
module.exports.add_order = add_order;


/**
 * Get order by his id
 * @param {number} order_id order ID
 * @return {Order} User password
 */
async function get_order_by_id(order_id) {
    try {
        const result1 = await Pool.query(`SELECT * from widok13 WHERE order_id = $1;`, [order_id]);

        let products_in_order = [];
        for (const prod of result1.rows) {
            products_in_order.push({
                id: prod.product_id,
                price: prod.price_when_bought,
                quantity: prod.quantity
            })
        }

        const user_info = await db_users.get_user_info_by_id(result1.rows[0].user_id);
        const user_address = await db_addresses.get_adress_by_user_id(result1.rows[0].user_id);

        return ({
            id: order_id,
            user_id: result1.rows[0].user_id,
            price: result1.rows[0].price_when_bought,
            products: products_in_order,
            user_info: user_info,
            address: user_address,
            status: result1.rows[0].status,
            date: result1.rows[0].date_of_purchase,
        })
    } catch (err) {
        throw_my_error(err);
    }

}

module.exports.get_order_by_id = get_order_by_id;

/**
 * Update orders status by his id 
 * @param {number} id order ID
 * @param {number} status new order status
 */
async function update_order_status(id, status) {
    try {
        const result1 = await Pool.query(`UPDATE all_orders SET status = $1 WHERE id = $2;`, [status, id]);
        return;
    } catch (err) {
        throw_my_error(err);
    }
}


module.exports.update_order_status = update_order_status;

/**
 * Gets all orders from user by his id 
* @param {number} user_id user ID
* @return {Order} User password
* @return {id: Number, date: date, price: Number[]} list of users orders with their id, date  and cost
 */
async function get_user_orders_info(user_id) {
    try {
        const result1 = await Pool.query(`SELECT * from widok13 WHERE user_id = $1 ORDER BY id;`, [user_id]);
        let users_orders = [];
        var last_order_id = result1.rows[0].id;
        let i = 0;
        while (result1.rows[i]) {
            if (i == 0) last_order_id = -1;
            else last_order_id = result1.rows[i - 1].id;
            if (result1.rows[i].id == last_order_id) { i++; continue; }
            const sum = await Pool.query(`SELECT SUM (price_when_bought) AS total FROM widok13 WHERE order_id = $1;`, [result1.rows[i].id]);
            users_orders.push({
                id: result1.rows[i].id,
                date: result1.rows[i].date_of_purchase,
                price: sum.rows[0].total
            })
            i++;
        }
        return users_orders;
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_user_orders_info = get_user_orders_info;