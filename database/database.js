module.exports = {
    ...require('./db_users'),
    ...require('./db_products'),
    ...require('./db_addresses'),
    ...require('./db_categories'),
}

module.exports.get_products_by_category = get_products_by_category;
async function get_products_by_category(id, number, start, type) {
    //kategoria, ile zwrócić, od jakiego zacząć, typ sortowania
}


/**
 * Hej Opisz Mnie i przenieś
 */
 async function add_order(order) {
    console.log('ok');
}

/**
 * Hej Opisz Mnie i przenieś
 */
 async function get_order_by_id(id) {
    return {order: "order"};
}

module.exports.get_order_by_id = get_order_by_id;
module.exports.add_order = add_order;
