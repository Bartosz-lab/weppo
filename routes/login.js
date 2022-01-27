const express = require('express');
const router = express.Router();
module.exports = router;

const auth = require('../bin/auth');
const typedef = require('../typedef');
const role = typedef.role;
const database = require('../database/database');

//logut path
router.get('/logout', (req, res) => {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(_ => {
        res.redirect('/');
    });
});

//login page
router.get('/login', (req, res) => {
    res.render('login/login', {
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/'
    });
});
router.post('/login', async (req, res) => {
    try {
        const id = await auth.authenticate(req.body.login, req.body.password);

        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(_ => {
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.user = id;
            // redirect to url before logging
            let returnUrl = req.query.returnUrl ? `/role?returnUrl=${req.query.returnUrl}` : '/role';
            res.redirect(returnUrl);
        });
    } catch (err) {
        console.log(err.message);
        if (err.message[0] === '2' || err.message[0] === '3') {
            req.session.error = err.message;
            res.redirect(req.url);
        } else {
            req.session.error = err.message;
            res.redirect('/error');
        }
    }
});

//choose role
router.get('/role', auth.restrict_login, async (req, res) => {
    try {
        const usr_roles = await database.check_user_roles(req.session.user);
        const usr_info = await database.get_user_info_by_id(req.session.user);

        const number_of_roles = +usr_roles[role.Admin] + usr_roles[role.Seller] + usr_roles[role.Customer];
        if (number_of_roles >= 2) {
            res.render('login/role-switch', {
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
            const returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
            res.redirect(returnUrl);
        } else {
            req.session.error = '4. Something went wrong';
            res.redirect('/error');
        }
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});
router.post('/role', auth.restrict_login, async (req, res) => {
    try {
        const selected_role = parseInt(req.body.user_role);
        const usr_roles = await database.check_user_roles(req.session.user);
        let usr_role;
        switch (selected_role) {
            case role.Admin:
                usr_role = role.Admin;
                break;
            case role.Seller:
                usr_role = role.Seller;
                break;
            case role.Customer:
                usr_role = role.Customer;
                break;
        }
        if (usr_roles[usr_role]) {
            req.session.role = selected_role;
            const returnUrl = req.query.returnUrl ? req.query.returnUrl : '/';
            res.redirect(returnUrl);
        } else {
            req.session.error = '4. Something went wrong';
            res.redirect('/error');
        }
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

//register page
router.get('/register', (req, res) => {
    res.render('login/register', {
        returnUrl: req.query.returnUrl ? req.query.returnUrl : '/'
    });
});
router.post('/register', (req, res) => {
    try {
        const user_info = {
            name: req.body.firstname,
            surname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.login,
        };
        auth.register(user_info, req.body.login, req.body.password);

        req.session.error = '0. Success';
        // redirect to url before logging
        const returnUrl = req.query.returnUrl ? `/login?returnUrl=${req.query.returnUrl}` : '/login';
        res.redirect(returnUrl);
    } catch (err) {
        req.session.error = err.message;
        res.redirect(req.url);
    }
});