const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const role = require('../bin/role');


router.get('/', auth.restrict_login, (req, res) => {
    switch (req.session.role) {
        case role.Admin: 
            res.send('lista zamówień Admin');
            break;
        case role.Seller: 
            res.send('lista zamówień sprzedawca');
            break;
        case role.Customer: 
            res.send('lista zamówień klient');
            break;
        default:
            res.send('Error');
    }
});

router.get('/:id', auth.restrict_login, (req, res) => {
    //strona zamówienia potrzebna weryfkacja czy zamówienie jest tego użytkownika
    res.send('zamówienie o id:' + req.params.id);
});