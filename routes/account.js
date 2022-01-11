const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');


router.get('/', auth.restrict_login, (req, res) => {
    res.render('account', { 
        name: "Jan", 
        surname: "Kowalski", 
        email: "jkowalski@gmail.com", 
        adress: "Nędza Wieś", 
        tel: "123456789"
    });
});

router.get('/settings', auth.restrict_login, (req, res) => {
    res.render('accountSettings', { 
        name: "Jan", 
        surname: "Kowalski", 
        email: "jkowalski@gmail.com", 
        adress: "Nędza Wieś", 
        tel: "123456789"
    });
});