const typedef = require('../typedef');
const role = typedef.role;
const Filter_type = typedef.filter_type;


//to jest do przerobienia aby każda funkcja była dodawana do export w miejscu jej definicji będzie czytelniej
module.exports = {
    ...require('./db_users'),
    get_user_by_username: get_user_by_username,
    get_id_of_user: get_id_of_user,
    check_user_role: check_user_role,
    get_adresses_by_user_id: get_adresses_by_user_id,
    get_adress_by_id: get_adress_by_id,
}
//Uwaga nie wszustkie funkcje mają poprawnie opisane params i opisy tego co powinny robić.
//W folderze database znajdują się tylko funkcje który mają poprawny opis (w sensie tego co robią [jeśli uważacie że moj styl opisu ich to opiszcie ładniej zachowójąc znaczenie])

//ostatecznie w tym pliku nie powinna znaleść się zadna funkcja, ma to byćjedynie hub do połączenia róznych stron działania bazy

//każda funkcja w bazie danych powinna zawierać weryfikacje poprawności danych.

const pool = require('./db_pool');


/**
 * Finding user by username function
 * @param {string} name username
 * @return {User} user object or undefined if user is not found
 */
async function get_user_by_username(name) {
    const result = await pool.query(`SELECT * FROM USERS WHERE USERNAME='${name}';`);
    if (result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}
/**
 * Finding user by id function
 * @param {number} id user ID
 * @return {{name: string, pass: string, salt: string}} user object or undefined if user is not found
 */
async function get_user_by_id(name) {
    const result = await pool.query(`SELECT * FROM USERS WHERE ID='${id}';`);
    if (result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}

/**
 * Finding user id by username function
 * @param {string} username username
 * @return {number | null} user id or null if user is not found
 */
async function get_id_of_user(username) {
    const result = await pool.query(`SELECT * FROM users WHERE username ='${username}';`);
    if (result.rows[0]) {
        return result.rows[0].id;
    }
    return new Error("6 invalid data");
}
module.exports.get_id_of_user = get_id_of_user;

/**
 * Finding username by id function
 * @param {number} id ID
 * @return {string | null} username or null if user is not found
 */
async function get_id_of_user(id) {
    const result = await pool.query(`SELECT * FROM users WHERE id ='${id}';`);
    if (result.rows[0]) {
        return result.rows[0].username;
    }
    return new Error("6 invalid data");
}


/**
 * Check user role
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {bool} true if user have this role
 */
/**
 * Check user role
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {bool} true if user have this role
 */
async function check_user_role(id, role) {
    const result = await pool.query(`SELECT * FROM roles WHERE user_id ='${id}';`);
    let i = 0;
    let roles = [];
    while (result.rows[i]) {
        roles.push(result.rows[i].role);
        i++;
    }
    return (roles.includes(role));
}
module.exports.check_user_role = check_user_role;

/**
 * opis
 * @param {number} id user id in database
 * @return {Adress} 
 */
async function get_adresses_by_user_id(id) {
    return {
        street: "Krakowska",
        zipcode: "12-345",
        city: "Wroclaw"
    }
}
/**
 * opis
 * @param {number} id adress id in database
 * @return {Adress[]} 
 */
async function get_adress_by_id(id) {

}

module.exports.get_products_by_category = get_products_by_category;
async function get_products_by_category(id, number, start, type) {
    //kategoria, ile zwrócić, od jakiego zacząć, typ sortowania
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
 * @param {{id:Number, value: (String[] | String)}[]} search_conds Search contitionals
 * @return {typedef.Product_for_list[]} list of products to display in list
 */
async function get_product_by_subcategory(id, sort_by, per_page, page, min_price, max_price, producer, search_conds) {
    console.log(min_price, max_price, producer, search_conds);
    // funkcja pobiera id kategorii i wyszukuje w niej określoną liczbę produktów (per_page)
    // uprzednio je sortując w odpowiednim typie i zwraca produkty na określoną stronę tzn.
    // page = 1 zwraca produkty 1-> per_page (zakładam liczenie od 1)
    // page = 2 zwraca produkty per_page+1-> 2*per_page (zakładam liczenie od 1)
    return [
        { id: 1, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 2, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.AFt6jAmiSg_OdO67WkA0CgHaD3%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000, params: [] },
        { id: 3, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 4, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 5, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.progarchives.com%2Fwallpapers%2FRUSHCOLLAGE.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 6, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 7, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9y2kjK5P_qFYJq3CMIMCcgHaHa%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 8, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 9, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shortlist.com%2Fmedia%2Fimages%2F2019%2F05%2Fthe-50-greatest-rock-albums-ever-3-1556678339-s1A3-column-width-inline.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 10, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.redroll.com%2Fwp-content%2Fuploads%2F2018%2F07%2Fprogrock1.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 11, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 12, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] }
    ]
}
module.exports.get_product_by_subcategory = get_product_by_subcategory;
/**
 * Get product
 * @param {Number} id Product ID
 * @return {typedef.Product} Product object
 */
async function get_product_by_id(id) {
    return {
        id: 1,
        subcat_id: 1,
        name: "Wasteland",
        price: 50,
        desc: "I'm your lie\n\
    I am your pretending\n\
    I'm the cause\n\
    Of your shame and anger<br>\
    \n\
    I'm your crime\n\
    Swept under the carpet\n\
    Your vanity\n\
    With all consequences",
        imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.angrymetalguy.com%2Fwp-content%2Fuploads%2F2018%2F09%2FPress_Cover_01-1.jpg&f=1&nofb=1",
        brand: "Riverside",
        params: [{ key: 'dysk', value: 100 }, { key: 'koło', value: 300 }]
    }
}
module.exports.get_product_by_id = get_product_by_id;

/**
 * Get list of products
 * @param {Number} id Subcategory ID
 * @return {typedef.Filter[]} list of Filters with his options
 */
async function get_filters_by_subcategory(id) {
    // zwraca tablicę objektów filtrów dla danej podkategorii
    return [{ id: 1, name: 'dysk', type: Filter_type.enum, options: [{ name: '100', sort_order: '1' }, { name: '200', sort_order: '2' }] },
    { id: 2, name: 'koła', type: Filter_type.enum, options: [{ name: '100', sort_order: '1' }, { name: '200', sort_order: '2' }] }]
}
module.exports.get_filters_by_subcategory = get_filters_by_subcategory;
/**
 * 
 * @param {Number} id Subcategory ID
 * @return {{category_id: Number, category_name: String, id: Number, name: String}} list of Filters with his options
 */
async function get_position_of_subcategory(id) {
    return { category_id: 1, category_name: "Podzespoły", id: id, name: "Dyski" };
}
module.exports.get_position_of_subcategory = get_position_of_subcategory;

/**
 * Get 
 * @param {Number} id Subcategory ID
 * @param {{id:Number, value: (String[] | String)}[]} search_conds Search contitionals
 * @return {typedef.Product_for_list[]} list of products to display in list
 */
 async function get_recemended_products_in_subcategory(id) {
    return [
        { id: 1, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 2, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.AFt6jAmiSg_OdO67WkA0CgHaD3%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000, params: [] },
        { id: 3, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 4, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 5, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.progarchives.com%2Fwallpapers%2FRUSHCOLLAGE.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 6, name: "Komp", imgurl: "images/test.png", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 7, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9y2kjK5P_qFYJq3CMIMCcgHaHa%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 8, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 9, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shortlist.com%2Fmedia%2Fimages%2F2019%2F05%2Fthe-50-greatest-rock-albums-ever-3-1556678339-s1A3-column-width-inline.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 10, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.redroll.com%2Fwp-content%2Fuploads%2F2018%2F07%2Fprogrock1.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 11, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] },
        { id: 12, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, params: [{ key: 'dysk', value: 100 }] }
    ]
}
module.exports.get_recemended_products_in_subcategory = get_recemended_products_in_subcategory;
/**
 * Get 
 * @param {Number} id user ID
 * @return {typedef.Product_for_basket[]} list of products to display in list
 */
 async function get_products_to_basket(id) {
    return [
        { id: 1, name: "Komp", imgurl: "images/test.png", price: 5000, quantity: 3 },
        { id: 2, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.AFt6jAmiSg_OdO67WkA0CgHaD3%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000, quantity: 2 },
        { id: 3, name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000, quantity: 2 },
        { id: 4, name: "Komp", imgurl: "images/test.png", price: 5000, quantity: 1 },
        { id: 5, name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.progarchives.com%2Fwallpapers%2FRUSHCOLLAGE.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000, quantity: 2 }]
}
module.exports.get_products_to_basket = get_products_to_basket;
/**
 * Get 
 * @param {Number} id product ID
 * @return {typedef.Product_for_basket} 
 */
 async function get_product_to_basket(id) {
    return { id: 1, name: "Komp", imgurl: "images/test.png", price: 5000 };
}
module.exports.get_product_to_basket = get_product_to_basket;
/**
 * add 
 * @param {Number} id product ID
 */
 async function add_product_to_basket(id) {
}
module.exports.add_product_to_basket = add_product_to_basket;
/**
 * Update 
 * @param {typedef.Product} product
 */
 async function update_product(product) {

}
module.exports.update_product = update_product;

/**
 *  
 * 
 */
 async function get_categories() {
    return [{id: 1, val: "dyski"},{id: 2, val: "komputery"},]
}
module.exports.get_categories = get_categories;
/**
 *  
 * 
 */
 async function get_subcategories() {
    tab =  [
        {id: 1, cat_id: 1, val: "hdd"},
        {id: 3, cat_id: 2, val: "PC"},
        {id: 2, cat_id: 1, val: "ssd"}, 
        {id: 4, cat_id: 2, val: "Laptop"}
    ].sort((a, b) => (a.cat_id > b.cat_id) ? 1 : ((a.cat_id == b.cat_id) ? ((a.id > b.id) ? 1 : -1) : -1));

    return tab;
}
module.exports.get_subcategories = get_subcategories;