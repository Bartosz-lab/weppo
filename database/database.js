const typedef = require('../typedef');
const role = typedef.role;
const Filter_type = typedef.filter_type;


//to jest do przerobienia aby każda funkcja była dodawana do export w miejscu jej definicji będzie czytelniej
module.exports = {
    ...require('./db_users'),
    ...require('./db_products'),
    ...require('./db_addresses'),
    ...require('./db_categories'),
}
//Uwaga nie wszustkie funkcje mają poprawnie opisane params i opisy tego co powinny robić.
//W folderze database znajdują się tylko funkcje który mają poprawny opis (w sensie tego co robią [jeśli uważacie że moj styl opisu ich to opiszcie ładniej zachowójąc znaczenie])

//ostatecznie w tym pliku nie powinna znaleść się zadna funkcja, ma to byćjedynie hub do połączenia róznych stron działania bazy

//każda funkcja w bazie danych powinna zawierać weryfikacje poprawności danych.
/**

 */
 async function save_user_adress(id) {
    //Proszę tworząc tą funkc
    
}
module.exports.save_user_adress = save_user_adress;


module.exports.get_products_by_category = get_products_by_category;
async function get_products_by_category(id, number, start, type) {
    //kategoria, ile zwrócić, od jakiego zacząć, typ sortowania
}

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
    return { id: id, name: "Komp", imgurl: "images/test.png", price: 5000 };
}
module.exports.get_product_to_basket = get_product_to_basket;

/**
 * update/add 
 * @param {Number} id product ID
 */
 async function update_product_in_basket(user_id, product_id, quantity) {
}
module.exports.update_product_in_basket = update_product_in_basket;
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
 async function del_product() {
}
module.exports.del_product = del_product;
