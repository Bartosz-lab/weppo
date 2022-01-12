const express = require('express');
//const { database } = require('pg/lib/defaults');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const database = require('../bin/database');


router.get('/', auth.restrict_login, async (req, res) => {

    const user = await database.get_user_info_by_id(req.session.user);
    if(user){
        res.render('account', user);
    } else {
        res.send("Error");
    }
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