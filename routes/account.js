const express = require('express');
const router = express.Router();
module.exports = router;

const upload = require('multer')();

const auth = require('../bin/auth');
const database = require('../database/database');
const typedef = require('../typedef');
const Role = typedef.role;

router.get('/', auth.restrict_login, async (req, res) => {
    try {
        let adress = undefined;
        if(req.session.role === Role.Customer) {
            adress = await database.get_adress_by_user_id(req.session.user);
        }
        const render_obj = {
            user: await database.get_user_info_by_id(req.session.user),
            adress: adress
        };
        res.render('account', render_obj);
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.get('/admin', auth.restrict_login, auth.restrict_role(Role.Admin),  async (req, res) => {
    try {
        res.render("admin-page")
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.get('/users', auth.restrict_login, auth.restrict_role(Role.Admin),  async (req, res) => {
    try {
        res.render("users-administration")
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.post('/edit_user', upload.single(), auth.restrict_login, async (req, res) => {
    try {
        await database.change_user_data(req.session.user, req.body.firstname, req.body.lastname, req.body.phone);
        res.end('0. Success');
    } catch (err) {
        res.end(err.message);
    }
});
router.post('/edit_email', upload.single(), auth.restrict_login,  async (req, res) => {
    try {
        await database.change_user_data(req.session.user, null, null, null, req.body.email);
        res.end('0. Success');
    } catch (err) {
        res.end(err.message);
    }
});
router.post('/edit_password', upload.single(), auth.restrict_login,   async (req, res) => {
    try {
        await auth.password_validation(req.session.user, req.body.last_password);
        await auth.change_password(req.session.user, req.body.password);
        res.end('0. Success');
    } catch (err) {
        res.end(err.message);
    }
});

router.post('/edit_adress', auth.restrict_login, async (req, res) => {
    console.log("edit")
    try {
        await database.save_user_adress(
            req.session.user, 
            req.body.street,
            req.body.nr_house,
            req.body.nr_flat,
            req.body.zip_code,
            req.body.city,
            req.body.country
        );
        res.send({Response: '0. Success'});
    } catch (err) {
        res.end(err.message);
    }
});

