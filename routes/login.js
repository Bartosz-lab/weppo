const express = require('express');
const router = express.Router();
module.exports = router;

const auth = require('../bin/auth');
const typedef = require('../typedef');
const role = typedef.role;
const database = require('../database/database');

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
    res.render('login/login', {
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/'
    });
});
router.post('/login',
    //midleware for login
    (req, res) => {
        auth.authenticate(req.body.login, req.body.password, (err, user) => {
            if (user) {
                // Regenerate session when signing in
                // to prevent fixation
                req.session.regenerate(_ => {
                    // Store the user's primary key
                    // in the session store to be retrieved,
                    // or in this case the entire user object
                    req.session.user = user;
                    // redirect to url before logging
                    let returnUrl = req.query.returnUrl ? `/role?returnUrl=${req.query.returnUrl}` : '/role';
                    res.redirect(returnUrl);
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
    });

//choose role
router.get('/role', auth.restrict_login, async (req, res) => {
    const usr_roles = await database.get_user_roles(req.session.user);
    const usr_info = await database.get_user_info_by_id(req.session.user);
    const number_of_roles = +usr_roles[role.Admin] + usr_roles[role.Seller] + usr_roles[role.Customer];
    if (number_of_roles >= 2) {
        res.render('login/roleSwitch', {
            role: typedef.role,
            active: usr_roles,
            name: usr_info.name,
            surname: usr_info.surname
        });
    } else if (number_of_roles > 0) {
        if (usr_roles[role.Admin]) {
            req.session.role = role.Admin;
        } else if (usr_roles[role.Seller]) {
            req.session.role = role.Seller;
        } else if (usr_roles[role.Customer]) {
            req.session.role = role.Customer;
        }
        let returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
        res.redirect(returnUrl);
    } else {
        req.session.error = '4. Something went wrong';
        res.redirect('/error');
    }
});
router.post('/role', auth.restrict_login, async (req, res) => {
    const usr_roles = await database.get_user_roles(req.session.user);

    let usr_role;
    if (role.Admin == req.body.user_role) {
        usr_role = role.Admin;
    } else if (role.Seller == req.body.user_role) {
        usr_role = role.Seller;
    } else if (role.Customer == req.body.user_role) {
        usr_role = role.Customer;
    }

    if (usr_roles[usr_role]) {
        req.session.role = req.body.user_role;
        let returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
        res.redirect(returnUrl);
    } else {
        req.session.error = '4. Something went wrong';
        res.redirect('/error');
    }
});

//register page
router.get('/register', function (req, res) {
    res.render('login/register', {
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/'
    });
});
router.post('/register', (req, res) => {
    auth.register({
        name: req.body.fistname,
        surname: req.body.lastname,
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