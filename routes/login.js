const express = require('express');
//const { database } = require('pg/lib/defaults');
const router = express.Router();
const auth = require('../bin/auth');
const typedef = require('../typedef');
const role = typedef.role;
const database = require('../database/database');

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
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/'
    });
});
router.post('/login',
    //midleware for login
    (req, res, next) => {
        auth.authenticate(req.body.login, req.body.password, (err, user) => {
            if (user) {
                // Regenerate session when signing in
                // to prevent fixation
                req.session.regenerate(_ => {
                    // Store the user's primary key
                    // in the session store to be retrieved,
                    // or in this case the entire user object
                    req.session.user = user;
                    //next midleware for choose role
                    next();
                });
            } else {
                if (err) {
                    req.session.error = err.message;
                } else {
                    req.session.error = '4. Something went wrong';
                }
                res.redirect(req.url);
            }
        });
    },
    //midleware for choose a role
    async (req, res) => {
        const usr_role = await database.get_user_roles(req.session.user);
        const number_of_roles = ((usr_role[role.Admin] ? 1 : 0) + (usr_role[role.Seller] ? 1 : 0) + (usr_role[role.Customer] ? 1 : 0));
        let returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
        if ( number_of_roles >= 2) {
            res.render('role', {
                role: typedef.role,
                active: usr_role
            });
        } else if ( number_of_roles > 0){
            if(usr_role[role.Admin]) {
                req.session.role = role.Admin;
            } else if(usr_role[role.Seller]){
                req.session.role = role.Seller;
            } else if(usr_role[role.Customer]){
                req.session.role = role.Customer;
            }
            res.redirect(returnUrl);
        } else {
            res.redirect('/error');
        }
    });

//register page
router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', (req, res) => {
    auth.register({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        email: req.body.login,
    },
        req.body.login, req.body.password, err => {
            if (err) {
                req.session.error = err.message;
                res.redirect(req.url);
            } else {
                req.session.error = '0. Success';

                // redirect to url before logging
                let returnUrl = req.query.returnUrl ? `/login?returnUrl=${req.query.returnUrl}` : '/login';
                res.redirect(returnUrl);
            }
        });
});