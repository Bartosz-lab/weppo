const hasher = require('pbkdf2-password')();

const database = require('../bin/database');

module.exports = {
  restrict: restrict,
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
function authenticate(name, pass, fn) {
  // query the database for the given username
  const user = database.get_user_by_username(name);

  if (!user) {
    return fn(new Error('cannot find user'));
  }

  // apply the same algorithm to the POSTed password, 
  // applying the hash against the pass / salt, 
  // if there is a match we found the user
  hasher({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) {
      return fn(err);
    }
    if (hash === user.hash) {
      return fn(null, user)
    }
    fn(new Error('invalid password'));
  });
}

/**
 * Middleware Function checking if user is logged in
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res 
 * @param {Function} next 
 */
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

/**
 * new user-customer registration function
 * @param {import('../bin/database').User_info} user_info user object
 * @param {string} email unique email as username 
 * @param {string} pass user password in plain text
 * @param {Function} fn function to be performed after registration
 * @return {Function} call given function fn
 */
function register(user_info, email, pass, fn) {
  if (!password_validation(pass)) {
    return fn(new Error('password too weak'));
  }
  let user = {
    email: email,
    user_info: user_info
  };

  // generate hash and salt for password
  hasher({ password: pass }, (err, pass, salt, hash) => {
    if (err) {
      throw err;
    }
    user.salt = salt;
    user.hash = hash;
  });

  // add user to database
  let db_err = database.add_user(user);
  if(db_err instanceof Error) {
    return fn(db_err);
  }
  // add customer role to database
  return fn(database.add_role_to_user(db_err, 3));
}

/**
 * Function verifies password strength
 * @param {string} pass password for validate
 * @return {bool} function return true if password is strong enough
 */
function password_validation(pass) {
  return true;
}