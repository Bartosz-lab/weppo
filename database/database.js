module.exports = {
    ...require('./db_users'),
    ...require('./db_products'),
    ...require('./db_addresses'),
    ...require('./db_categories'),
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
/**
 * Hej Opisz Mnie i przenieś
 */
 async function get_user_orders(id) {
     //wszystkie zamówienia użytkownika posortowane po statusie
    return [{order: "order"}];
}

module.exports.get_user_orders = get_user_orders;
/**
 * Hej Opisz Mnie i przenieś
 */
 async function get_uncomplited_orders(id) {
     //wszystkie zamówienia o statusie innym niż zakończone posortowane po statusie
    return [{order: "order"}];
}

module.exports.get_uncomplited_orders = get_uncomplited_orders;
/**
 * Hej Opisz Mnie i przenieś
 */
 async function update_order_status(id, status) {
     //zmiana statusu zamówienia
}

module.exports.update_order_status = update_order_status;
/**
 * Hej Opisz Mnie i przenieś
 */
 async function get_user_orders_info(id) {
     //dablica dat i cen i ID zamówienia 
     //przykład
     return [{id: 1, date: new Date(), price: 120},{id: 2, date: new Date(), price: 333},{id: 43, date: new Date(), price: 432}] 
}

module.exports.get_user_orders_info = get_user_orders_info;
module.exports.add_order = add_order;
