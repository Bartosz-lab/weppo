module.exports = {
    ...require('./db_users'),
    ...require('./db_products'),
    ...require('./db_addresses'),
    ...require('./db_categories'),
    ...require('./db_orders'),
}

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


