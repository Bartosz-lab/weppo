const express = require('express');
const router = express.Router();
const auth = require('../bin/auth');
const role = require('../bin/role');

module.exports = router;

//logut path
router.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});

//login page
router.get('/login', function (req, res) {
    res.render('login', { 
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/',
        error: ""
    });
});
router.post('/login', (req, res) => {
    auth.authenticate(req.body.login, req.body.password, (err, user) => {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate( _ => {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;

                //miejsce na zastanowienie się jak to jest z tymi rolami
                req.session.role = role.Customer;

                // redirect to url before logging
                let returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
                res.redirect(returnUrl);
            });
        } else {
            if(err) {
                req.session.error = err.message;
            } else {
                req.session.error = '4. Something went wrong';
            }
            res.redirect(req.url);
        }
    });
});

//register page
router.get('/register', function (req, res) {
    res.render('register', {error: ''});
});
router.post('/register', (req, res) => {
    auth.register({
                    name: req.body.name,
                    surname: req.body.surname,
                    phone: req.body.phone,
                }, 
                req.body.login, req.body.password, err => {
        if (err) {
            req.session.error = err.message;
            res.redirect(req.url);
        } else {
            req.session.error = '0. Success';

            // redirect to url before logging
            let returnUrl = req.query.returnUrl ? `/login?returnUrl=${req.query.returnUrl}`: '/login';
            res.redirect(returnUrl);
        }
    });
});