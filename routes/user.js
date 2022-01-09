const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const role = require('../bin/role');


router.get('/', auth.restrict_login, auth.restrict_role(role.Admin), (req, res) => {
    res.send('Lista użytkowników');
});

router.get('/:id', auth.restrict_login, auth.restrict_role(role.Admin), (req, res) => {
    res.send('użytkownik nr '+ req.params.id);
});