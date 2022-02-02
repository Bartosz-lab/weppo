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
        res.render('users-administration', {users: users});

    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.get('/:id', auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    try {
        const user = await database.get_user_info_by_id(req.params.id);
        res.send(user);

    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});