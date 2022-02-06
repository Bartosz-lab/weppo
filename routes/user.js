const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const auth = require('../bin/auth');
const typedef = require('../typedef');
const Role = typedef.role;


router.get('/', auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    try {
        const users = await database.get_users();
        res.render('users-administration', { users: users });

    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.post('/promote', auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    try {
        await database.add_role_to_user(req.body.id, +req.body.role);
        res.redirect('/users');
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.get('/:id', auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    //zmiana na render
    try {
        const render_obj = {
            user: await database.get_user_info_by_id(req.params.id),
            adress: await database.get_adress_by_user_id(req.params.id)
        }
        res.send(render_obj);

        } catch (err) {
            req.session.error = err.message;
            res.redirect('/error');
        }
    });