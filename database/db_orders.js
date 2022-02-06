const Pool = require('../database/db_pool');
const throw_my_error = require('../database/throw_error');
const typedef = require('../typedef');

/**
 * Add a new order 
 * @param {typedef.Order} order order to add
 */
async function add_order(order) {
    try {
        const result1 = await Pool.query(`INSERT INTO order_addresses (street, nr_house, nr_flat, zip_code, city, country, firstname, lastname, phone, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING  id;`,
            [order.address.street, order.address.nr_house, order.address.nr_flat, order.address.zip_code, order.address.city, order.address.country, order.user_info.name, order.user_info.surname, order.user_info.phone, order.user_info.email]);
        const result2 = await Pool.query(`INSERT INTO all_orders (user_id, address_id, status, date_of_purchase, price) VALUES
    ($1, $2, $3, $4, $5) RETURNING id;`, [order.user_id, result1.rows[0].id, order.status, order.date, order.price]);
        for (const prod_in_order of order.products) {
            await Pool.query(`INSERT INTO this_order (order_id, product_id, quantity, price_when_bought) VALUES
        ($1, $2, $3, $4);`, [result2.rows[0].id, prod_in_order.id, prod_in_order.quantity, prod_in_order.price]);
        }
    } catch (err) {
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
        //to jest całkiem do zmiany




        // const result1 = await Pool.query(`SELECT * from widok14 WHERE order_id = $1;`, [order_id]);

        // let products_in_order = [];
        // for (const prod of result1.rows) {
        //     products_in_order.push({
        //         id: prod.product_id,
        //         price: prod.price_when_bought,
        //         quantity: prod.quantity
        //     })
        // }

        // //const user_info = await db_users.get_user_info_by_id(result1.rows[0].user_id);
        // //const user_address = await db_addresses.get_adress_by_user_id(result1.rows[0].user_id);

        // return ({
        //     id: order_id,
        //     user_id: result1.rows[0].user_id,
        //     price: result1.rows[0].price_when_bought,
        //     products: products_in_order,
        //     user_info: user_info,
        //     address: user_address,
        //     status: result1.rows[0].status,
        //     date: result1.rows[0].date_of_purchase,
        // })
    } catch (err) {
        throw_my_error(err);
    }

}
module.exports.get_order_by_id = get_order_by_id;

/**
* Get all users orders sorted by statys
* @param {number} user_id user ID
* @return {Order[]} list of all users orders
*/
async function get_user_orders(user_id) {
    try {
        const result1 = await Pool.query(`SELECT * from all_orders WHERE user_id = $1 ORDER BY status;`, [user_id]);
        let all_orders = [];
        for (const obj of result1.rows) {
            const order = await get_order_by_id(obj.id);
            all_orders.push(order);
        }
        return all_orders;
    } catch (err) {
        throw_my_error(err);
    }

}
module.exports.get_user_orders = get_user_orders;

/**
 * Update orders status by his id 
 * @param {number} id order ID
 * @param {number} status new order status
 */
async function update_order_status(id, status) {
    try {
        await Pool.query(`UPDATE all_orders SET status = $1 WHERE id = $2;`, [status, id]);
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.update_order_status = update_order_status;

/**
 * Gets all orders from user by his id 
* @param {number} user_id user ID
* @return {{id: Number, date: date, price: Number}[]} list of users orders with their id, date  and cost
 */
async function get_user_orders_info(user_id) {
    try {
        const result1 = await Pool.query(`SELECT * from all_orders WHERE (user_id = $1) AND (status != $2 OR status IS NULL);`, [user_id, typedef.order_status.complited]);
        let users_orders = [];

        for (const order of result1.rows) {
            users_orders.push({
                id: order.id,
                date: order.date_of_purchase,
                price: order.price
            })
        }
        return users_orders;
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_user_orders_info = get_user_orders_info;

/**
* Get all orders that are not already completed
* @return {Order[]} list of orders
*/
async function get_uncomplited_orders() {
    try {
        const result1 = await Pool.query(`SELECT id FROM all_orders WHERE (status != $1 OR status IS NULL);`, [typedef.order_status.complited]);
        let all_orders = [];
        for (const obj of result1.rows) {
            const order = await get_order_by_id(obj.id);
            all_orders.push(order);
        }
        return all_orders;
    } catch (err) {
        throw_my_error(err);
    }
}
module.exports.get_uncomplited_orders = get_uncomplited_orders;