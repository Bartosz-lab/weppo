const hasher = require('pbkdf2-password')();

const database = require('../bin/database');
const role = require('../bin/role');

module.exports = {
  restrict_login: restrict_login,
  restrict_role: restrict_role,
  authenticate: authenticate,
  register: register
}

/**
 * logging validation function
 * @param {string} name username
 * @param {string} pass password
 * @param {Function} fn function to be performed after authorization
 * @return {Function} call given function fn
 */
async function authenticate(name, pass, fn) {
  // query the database for the given username
  const user = await database.get_user_by_username(name);

  if (!user) {
    return fn(new Error('2. Invalid login'));
  }

  // apply the same algorithm to the POSTed password, 
  // applying the hash against the pass / salt, 
  // if there is a match we found the user
  hasher({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) {
      return fn(err);
    }
    if (hash === user.hash) {
      return fn(null, user.id)
    }
    fn(new Error('3. Invalid password'));
  });
}

/**
 * new user-customer registration function
 * @param {database.User_info} user_info user object
 * @param {string} email unique email as username 
 * @param {string} pass user password in plain text
 * @param {Function} fn function to be performed after registration
 * @return {Function} call given function fn
 */
async function register(user_info, login, pass, fn) {
  if (!password_validation(pass)) {
    return fn(new Error('5. Password too weak'));
  }
  let user = {
    email: login,
    user_info: user_info
  };

  // generate hash and salt for password
  hasher({ password: pass }, (err, pass, salt, hash) => {
    if (err) {
      return fn(err);
    }
    user.salt = salt;
    user.hash = hash;

    // add user to database
    let db_err = await database.add_user(user);
    if (db_err instanceof Error) {
      return fn(db_err);
    }
    // add customer role to database
    return fn(database.add_role_to_user(db_err, role.Customer));
  });
  return fn(new Error('4. Something went wrong'));
}

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
  return (req, res, next) => {
    if (database.check_user_role(req.session.user, role)) {
      next();
    } else {
      req.session.error = '1. Access deined';
      res.send('NIe posiadasz odpowiedniej roli');
    }
  }
}

/**
 * Function verifies password strength
 * @param {string} pass password for validate
 * @return {bool} function return true if password is strong enough
 */
function password_validation(pass) {
  return true;
}