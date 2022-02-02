module.exports = {
    ...require('./db_users'),
    ...require('./db_products'),
    ...require('./db_addresses'),
    ...require('./db_categories'),
}
/**
 * Hej Opisz Mnie i przenieś
 */
async function save_user_adress(user_id, street, nr_house, nr_flat, zip_code, city, country) {
    //zdecydiwanie potrzebny + opis poproszę
    console.log("SET ADRESS NOT IMPLEMENTED");
    console.log(`Data: id: ${user_id} st: ${street} nr h: ${nr_house} nr f: ${nr_flat} zip: ${zip_code} city: ${city} counry: ${country}`);
}

module.exports.save_user_adress = save_user_adress;

/**
 * Hej Opisz Mnie i przenieś
 */
const Pool = require('../database/db_pool');
async function get_users() {
    try {
        const result = await Pool.query(`SELECT id, firstname, lastname, phone, email FROM users`);
        let users = [];
        for (const row of result.rows) {
            const user = {
                id: row.id,
                name: row.firstname,
                surname: row.lastname,
                phone: row.phone,
                email: row.email
            }
        users.push(user);
    }
        return users;
} catch (err) {
    throw err;
}
    
}
module.exports.get_users = get_users;


module.exports.get_products_by_category = get_products_by_category;
async function get_products_by_category(id, number, start, type) {
    //kategoria, ile zwrócić, od jakiego zacząć, typ sortowania
}

/**
 * Get 
 * @param {Number} id product ID
 * @return {typedef.Product_for_basket} 
 */
async function get_product_to_basket(id) {
    //zdecydowanie potrzebne 
    return require('./db_products').get_product_by_id(id);
    //return { id: id, name: "Komp", imgurl: "images/test.png", price: 5000 };
}
module.exports.get_product_to_basket = get_product_to_basket;
