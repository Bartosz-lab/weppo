const Pool = require('../database/db_pool');
const typedef = require('../typedef');
const role = typedef.role;



/**
 * Finding user by id function
 * @param {number} id user ID
 * @return {{name: string, pass: string, salt: string}} user object or undefined if user is not found
 */
 async function get_user_by_id(name) {
    const result = await Pool.query(`SELECT * FROM USERS WHERE ID='${id}';`);
    if(result.rows[0]) {
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
    const result = await Pool.query(`SELECT * FROM users WHERE username ='${username}';`);
    if(result.rows[0]) {
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
    const result = await Pool.query(`SELECT * FROM users WHERE id ='${id}';`);
    if(result.rows[0]) {
      return result.rows[0].username;
    }
    return new Error("6 invalid data");
}
  
/**
 * Finding user by username function returning only information for log in
 * @param {string} name username
 * @return {{id: string, hash: string, salt: string}} object with id hash and salt or undefined if user is not found
 */
 async function get_user_by_username_for_login(name) {
    //powinna zwracać tylko odpowiednie dane patrz wyżej
    const result = await Pool.query(`SELECT * FROM users WHERE username ='${name}';`);
    if(result.rows[0]) {
        let my_result = result.rows[0]; 
        let login_info = {
          id : my_result.id,
          hash : my_result.hash,
          salt : my_result.salt
        };
        return login_info;
    }
    else return (undefined);
}
module.exports.get_user_by_username_for_login = get_user_by_username_for_login;

/**
 * Finding User information by id function
 * @param {number} id user ID
 * @return {User_info}  Returning User_info object or undefined if user is not found 
 */
 async function get_user_info_by_id(id) {
    const result = await Pool.query(`SELECT * FROM users WHERE ID='${id}';`);
    if(result.rows[0]) {
        let my_User_info = {
          name : result.rows[0].firstname,
          surname : result.rows[0].lastname,
          phone : result.rows[0].phone,
          email : result.rows[0].email
        }
        return (my_User_info);
    }
    else {
      return (undefined);
    }
}
module.exports.get_user_info_by_id = get_user_info_by_id;

/**
 * Add user to database
 * @param {User} user User object to be added to database
 * @return {Error|number} error or user ID
 */
async function add_user(user) {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 
    // mejl zawiera malpe, phone ma 9 cyfr i 2 myslinki, 
    // imie i nazwisko z duzej litery sie zaczyna, reszta mala, nie pusty
    // zmienic phone na text w bazie
    try {
        const result = await Pool.query(`INSERT INTO users VALUES (DEFAULT, 
    '${user.username}', '${user.hash}', '${user.salt}', '${user.user_info.name}',
    '${user.user_info.surname}','${user.user_info.phone}','${user.user_info.email}' ) RETURNING id;`);
        if (result.rows[0]) {
            return result.rows[0].id;
        }
        return new Error("6 invalid data");
    } catch (err) {
        return err;
    }

}
module.exports.add_user = add_user;

/**
 * Add role to user
 * @param {number} id user id in database
 * @param {typedef.Role} role role of user from typedef.role
 * @return {Error} error or undefined if role is saved correctly
 */
 async function add_role_to_user(id, role) {
    //Sprawdzamy czy user juz nie ma tej roli
    const result = await Pool.query(`SELECT * FROM roles WHERE user_id ='${id}';`);
    let i = 0;
    let roles = [];
    while (result.rows[i]) {
      roles.push(result.rows[i].role);
      i++;
    }
    if (!(result.rows[0]) || (roles.includes(role))) return ("ERROR - nie ma takiego uzytownika lub ma juz te role");
    //Dodajemy role
    const result2 = await Pool.query(`INSERT INTO roles (user_id, role) VALUES ('${id}', '${role}')`);
    return undefined;
  }
  module.exports.add_role_to_user = add_role_to_user;

/**
 * Finding User roles by id
 * @param {number} id user ID
 * @return {Role} roles 
 */
 async function get_user_roles(id) {
    const result = await Pool.query(`SELECT * FROM roles WHERE user_id ='${id}';`);
    let i = 0;
    let roles = [];
    while (result.rows[i]) {
      roles.push(result.rows[i].role);
      i++;
    }
    let ret_obj = {};
    ret_obj[role.Admin] = roles.includes("Admin");
    ret_obj[role.Seller] =  roles.includes("Seller");
    ret_obj[role.Customer] =  roles.includes("Customer")
    
    return ret_obj;
  }  
module.exports.get_user_roles = get_user_roles;

/**
 * Check user role
 * @param {number} id user id in database
 * @param {number} role 0 - admin, 1 - seller, 3 - client
 * @return {bool} true if user have this role
 */
 async function check_user_role(id, role) {
    const result = await Pool.query(`SELECT * FROM roles WHERE user_id ='${id}';`);
    let i = 0;
    let roles = [];
    while (result.rows[i]) {
      roles.push(result.rows[i].role);
      i++;
    }
    return (roles.includes(role));
}
module.exports.check_user_role = check_user_role;
