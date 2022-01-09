const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const role = require('../bin/role');


router.get('/', auth.restrict_login, auth.restrict_role(role.Customer), (req, res) => {
    res.send('Lista adresów użytkownika');
});

router.get('/:id', auth.restrict_login, auth.restrict_role(role.Customer), (req, res) => {
    res.send('Adres nr '+ req.params.id);
});