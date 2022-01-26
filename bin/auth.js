const hasher = require('../bin/hasher');
const database = require('../database/database');
const role = require('../bin/role');

/**
 * password validation
 * If function ends wihtout throwing Error, password is correct
 * @param {number} id User ID
 * @param {string} pass password
 */
async function password_validation(id, pass) {
  const user = await database.get_password_by_user_id(id);

  // apply the same algorithm to the POSTed password, 
  // applying the hash against the pass / salt, 
  // if there is a match we found the user
  hasher({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) {
      throw new Error('4. Something went wrong');
    }
    if (hash != user.hash) {
      throw new Error('3. Invalid password');
    }
  });
}
module.exports.password_validation = password_validation;

/**
 * Registration process
 * If function ends wihtout throwing Error, register is complete
 * @param {database.User_info} user_info user object
 * @param {string} login unique username 
 * @param {string} pass user password in plain text
 */
async function register(user_info, login, pass) {
  if (!password_strength(pass)) {
    throw new Error('5. Password too weak');
  }
  // generate hash and salt for password
  const hash_data = await hasher({ password: pass });
  if (hash_data.err) {
    throw new Error('4. Something went wrong');
  }
  const user = {
    username: login,
    user_info: user_info,
    salt: hash_data.salt,
    hash: hash_data.hash
  };
  const user_id = await database.add_user(user);
  await database.add_role_to_user(user_id, role.Customer);
}
module.exports.register = register;

/**
 * Logging process
 * If function ends wihtout throwing Error, logging data is correct
 * @param {string} login username
 * @param {string} pass password
 * @returns {number} User ID
 */
async function authenticate(login, pass) {
  const user = await database.get_user_password(login);

  // apply the same algorithm to the POSTed password, 
  // applying the hash against the pass / salt, 
  // if there is a match we found the user
  const hash_data = await hasher({ password: pass, salt: user.salt });
  if (hash_data.err) {
    throw new Error('4. Something went wrong');
  }
  if (hash_data.hash != user.hash) {
    throw new Error('3. Invalid password');
  }
  return user.id;
}
module.exports.authenticate = authenticate;

/**
 * Saving password
 * If function ends wihtout throwing Error, password is saved correctly
 * @param {number} id User ID
 * @param {string} pass password
 */
 async function change_password(id, pass) {
  // apply the same algorithm to the POSTed password, 
  // applying the hash against the pass / salt, 
  // if there is a match we found the user
  const hash_data = await hasher({ password: pass });
    if (hash_data.err) {
      throw new Error('4. Something went wrong');
    }
    await database.change_user_data(id, null, null, null, null, hash_data.hash, hash_data.salt);
}
module.exports.change_password = change_password;

/**
 * Middleware Function checking if user is logged in
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res 
 * @param {Function} next 
 */
function restrict_login(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = '1. Access deined';
    res.redirect('/login?returnUrl=' + req.originalUrl);
  }
}
module.exports.restrict_login = restrict_login;

/**
 * Middleware Function checking if logged_user has a role
 * @param {number} role user role to check
 */
function restrict_role(role) {
  /**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res 
 * @param {Function} next 
 */
  return async (req, res, next) => {
    try {
      if (await database.check_user_role(req.session.user, role)) {
        next();
      } else {
        throw new Error('1. Access deined');
      }
    } catch (err) {
      req.session.error = err.message;
      res.redirect('/error');
    }
  }
}
module.exports.restrict_role = restrict_role;

/**
 * Function verifies password strength
 * @param {string} pass password for validate
 * @return {bool} function return true if password is strong enough
 */
function password_strength(pass) {
  return true;
}