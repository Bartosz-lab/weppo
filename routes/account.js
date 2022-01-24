const express = require('express');
const router = express.Router();
module.exports = router;

const upload = require('multer')();

const auth = require('../bin/auth');
const database = require('../database/database');

router.get('/', auth.restrict_login, async (req, res) => {
    try {
        const render_obj = {
            user: await database.get_user_info_by_id(req.session.user),
            adress: await database.get_adresses_by_user_id(req.session.user)

        };
        res.render('account', render_obj);
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
router.post('/edit_email', upload.single(), auth.restrict_login, async (req, res) => {
    try {
        await database.change_user_data(req.session.user, null, null, null, req.body.email);
        res.end('0. Success');
    } catch (err) {
        res.end(err.message);
    }
});
router.post('/edit_password', upload.single(), auth.restrict_login, async (req, res) => {
    try {
        await auth.password_validation(req.session.user, req.body.last_password);
        await auth.change_password(req.session.user, req.body.password);
        res.end('0. Success');
    } catch (err) {
        res.end(err.message);
    }
});