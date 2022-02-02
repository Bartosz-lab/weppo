/**
 * Throwing errors 
 * @param {Error} err error
 */
 function throw_my_error(err) {
    //to się potwarza w każdym pliku więc proponuję wywalenie tego do osobnego
    if (+err.message[0] >= 0 && +err.message[0] <= 10) {
        throw err;
    } else {
        throw new Error('7. Database Error');
    }
}
module.exports.throw_my_error = throw_my_error;