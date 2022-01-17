const Pool = require('../database/db_pool');
const typedef = require('../typedef');
const role = typedef.role;

/**
 * Finding user by username function returning only information for log in
 * @param {string} name username
 * @return {{id: string, hash: string, salt: string}} object with id hash and salt or undefined if user is not found
 */
 async function get_user_by_username_for_login(name) {
    //powinna zwracać tylko odpowiednie dane patrz wyżej
    const result = await Pool.query(`SELECT * FROM USERS WHERE USERNAME='${name}';`);
    if(result.rows[0]) {
        return result.rows[0];
    }
    return undefined;
}
module.exports.get_user_by_username_for_login = get_user_by_username_for_login;

/**
 * Finding User information by id function
 * @param {number} id user ID
 * @return {User_info}  Returning User_info object or undefined if user is not found 
 */
 async function get_user_info_by_id(id) {
    // const result = await Pool.query(`SELECT * FROM USERS WHERE ID='${id}';`);
    // if(result.rows[0]) {
    //     return result.rows[0];
    // }
    return {
        name: "Jan", 
        surname: "Kowalski", 
        tel: "123456789",
        email: "jkowalski@gmail.com"
    };
}
module.exports.get_user_info_by_id = get_user_info_by_id;

/**
 * Add user to database
 * @param {User} user User obiect for add to database
 * @return {Error|number} error or user ID
 */
 async function add_user(user) {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 
    //oraz zmiana query tak aby przetwarzała objekt user(definicja na górze pliku) na wpis w tabeli

    const result = await Pool.query(`INSERT INTO USERS VALUES (DEFAULT, '${user.username}', '${user.hash}', '${user.salt}') RETURNING id;`);
    if(result.rows[0]) {
        return result.rows[0].id;
    }
    return new Error("TU powinien być odpowiedni kod błędu");
}
module.exports.add_user = add_user;

/**
 * Add role to user
 * @param {number} id user id in database
 * @param {typedef.Role} role role of user from typedef.role
 * @return {Error} error or undefined if role is saved correctly
 */
 async function add_role_to_user(id, role) {
    //??
    return undefined;
}
module.exports.add_role_to_user = add_role_to_user;