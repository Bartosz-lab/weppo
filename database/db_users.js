const Pool = require('../database/db_pool');
const typedef = require('../typedef');
const role = typedef.role;

/**
 * Finding password by User ID
 * @param {number} id user ID
 * @return {{hash: string, salt: string}} User password
 */
async function get_password_by_user_id(id) {
  try {
    const result = await Pool.query(`SELECT hash, salt FROM USERS WHERE ID=$1;`, [id]);
    if (result.rows[0]) {
      return result.rows[0];
    } else {
      throw new Error('8. User not found');
    }
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.get_password_by_user_id = get_password_by_user_id;

/**
 * Finding User information by User ID
 * @param {number} id user ID
 * @return {typedef.User_info}  User_info object
 */
async function get_user_info_by_id(id) {
  try {
    const result = await Pool.query(`SELECT firstname, lastname, phone, email FROM users WHERE ID=$1;`, [id]);
    if (result.rows[0]) {
      return {
        name: result.rows[0].firstname,
        surname: result.rows[0].lastname,
        phone: result.rows[0].phone,
        email: result.rows[0].email
      };
    }
    else {
      throw new Error('8. User not found');
    }
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.get_user_info_by_id = get_user_info_by_id

/**
 * Add user to database
 * @param {typedef.User} user User object to be added to database
 * @return {number} user ID
 */
async function add_user(user) {
  try {
    //tutaj potrzebne będzie sprawdzanie poprawności danych 
    // mejl zawiera malpe, phone ma 9 cyfr i 2 myslinki, 
    // imie i nazwisko z duzej litery sie zaczyna, reszta mala, nie pusty
    // zmienic phone na text w bazie
    const result = await Pool.query(
      `INSERT INTO users (id, username, hash, salt, firstname, lastname, phone, email) VALUES 
      (DEFAULT, $1, $2, $3, $4, $5, $6, $7 ) RETURNING id;`,
      [user.username, user.hash, user.salt, user.user_info.name, user.user_info.surname, user.user_info.phone, user.user_info.email]);
    if (!result.rows[0]) {
      throw new Error('7. Database Error');
    }
    return result.rows[0].id;
  } catch {
    throw new Error('7. Database Error');
  }

}
module.exports.add_user = add_user;

/**
 * Add role to user
 * If function ends wihtout throwing Error, role is added correctly
 * @param {number} id user id in database
 * @param {typedef.Role} role role of user from typedef.role
 */
async function add_role_to_user(id, role) {
  try {
    if (await check_user_role(id, role)) {
      throw new Error('9. User have this role');
    }
    await Pool.query(`INSERT INTO roles (user_id, role) VALUES ($1, $2)`, [id, role]);
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.add_role_to_user = add_role_to_user;

/**
 * Check user role
 * @param {number} id user id in database
 * @param {typedef.Role} role role of user from typedef.role
 * @return {bool} true if user have this role
 */
async function check_user_role(id, role) {
  try {
    const result = await Pool.query(`SELECT role FROM roles WHERE user_id =$1;`, [id]);
    let roles = [];

    for (let i = 0; i < result.rows.length; i++) {
      roles.push(result.rows[i].role);
    }
    return (roles.includes(role));
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.check_user_role = check_user_role;

/**
 * Finding User roles by id
 * @param {number} id user ID
 * @return {Object} Object with key named by Role.role and bool value
 */
 async function get_user_roles(id) {
  try {
    const result = await Pool.query(`SELECT role FROM roles WHERE user_id =$1;`, [id]);
    let roles = [];

    for (let i = 0; i < result.rows.length; i++) {
      roles.push(result.rows[i].role);
    }

    let ret_obj = {};
    ret_obj[role.Admin] = roles.includes(role.Admin);
    ret_obj[role.Seller] = roles.includes(role.Seller);
    ret_obj[role.Customer] = roles.includes(role.Customer);
  
    return ret_obj;
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.get_user_roles = get_user_roles;













/**
 * Finding user id by username function
 * @param {string} username username
 * @return {number | null} user id or null if user is not found
 */
async function get_id_of_user(username) {
  const result = await Pool.query(`SELECT * FROM users WHERE username ='${username}';`);
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
  const result = await Pool.query(`SELECT * FROM users WHERE id ='${id}';`);
  if (result.rows[0]) {
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
  if (result.rows[0]) {
    let my_result = result.rows[0];
    let login_info = {
      id: my_result.id,
      hash: my_result.hash,
      salt: my_result.salt
    };
    return login_info;
  }
  else return (undefined);
}
module.exports.get_user_by_username_for_login = get_user_by_username_for_login;

;






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

/**
 * Change user name / surname / phone / password / email
 * @param {number} id user id in database
 * @param {string} new_name User Firstname
 * @param {string} new_lastname User Lastame
 * @param {string} new_phone User Phone Number
 * @param {string} new_email User Email
 * @param {string} new_hash User Hashed Password
 * @param {string} new_salt User salt for Password
 */
async function change_user_data(id, new_name, new_lastname, new_phone, new_email, new_hash, new_salt) {
  //brakuje lepszego sprawdzenia czy parametr ma być przesłany, a jeśli tak to czy jest on poprawny
  //proponuję stworzenie osobnego pliku z funkcjami sprawdź czy poprawe imie, nazwisko, telefon itp.
  try {
    const result = await Pool.query(`SELECT * FROM roles WHERE user_id=$1;`, [id]);
    if (result.rows[0]) {
      let query = 'UPDATE users SET';
      let params = [id];
      let i = 2;
      if (typeof new_name === 'string') {
        query += ` firstname=$${i++}`;
        params.push(new_name);
      }
      if (typeof new_lastname === 'string') {
        if (i > 2) query += ',';
        query += ` lastname=$${i++}`;
        params.push(new_lastname);
      }
      if (typeof new_hash === 'string') {
        if (i > 2) query += ',';
        query += ` hash=$${i++}`;
        params.push(new_hash);
      }
      if (typeof new_salt === 'string') {
        if (i > 2) query += ',';
        query += ` salt=$${i++}`;
        params.push(new_salt);
      }
      if (typeof new_email === 'string') {
        if (i > 2) query += ',';
        query += ` email=$${i++}`;
        params.push(new_email);
      }
      if (typeof new_phone === 'string') {
        if (i > 2) query += ',';
        query += ` phone=$${i++}`;
        params.push(new_phone);
      }
      query += ' WHERE id=$1;';
      await Pool.query(query, params);
    }
  } catch {
    throw new Error('7. Database Error');
  }
}
module.exports.change_user_data = change_user_data;
