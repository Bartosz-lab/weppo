const hasher = require('pbkdf2-password')();

module.exports = (data) => {
    return new Promise((resolve, reject) => {
        hasher({ password: data.password, salt: data.salt }, (err, pass, salt, hash) => {
            if (err) {
                return reject(err);
            }
            resolve({
                err: err,
                pass: pass,
                salt: salt,
                hash: hash
            });
        });
    });
}