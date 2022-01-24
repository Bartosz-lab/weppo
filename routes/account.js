const express = require('express');
//const { database } = require('pg/lib/defaults');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const database = require('../database/database');
const multer = require('multer');
var upload = multer();


router.get('/', auth.restrict_login, async (req, res) => {
    /**
     *  2. Twoje adresy wyświetlający 2-3 adresy każdy posiadający guzik edytuj oraz guzik pokaż wszystkie
     * Przekazywany objekt do widoku 
     *     user- typ {User_info} - definicja w database
     *     adress = typ{Adress[]} - definicja w database
     */
    let render_obj = {};
    render_obj.user = await database.get_user_info_by_id(req.session.user);
    render_obj.adress = await database.get_adresses_by_user_id(req.session.user);

    render_obj.orders = [
        { date: "12-01-2022", price: "200" },
        { date: "13-02-2077", price: "1337" }
    ];

    console.log(render_obj.user.phone);
    if (render_obj.user) {
        res.render('account', render_obj);
    } else {
        //tutaj trzeba wrócić
        res.send("Error");
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