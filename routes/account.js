const express = require('express');
//const { database } = require('pg/lib/defaults');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const database = require('../database/database');


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
    console.log(render_obj.user.phone);
    if(render_obj.user){
        res.render('account', render_obj);
    } else {
        //tutaj trzeba wrócić
        res.send("Error");
    }
});

router.post('/edit_user', auth.restrict_login, async (req, res) => {
    const edited_user = {
        name: req.body.fistname,
        surname: req.body.lastname,
        phone: req.body.phone
    };
    const err = await database.change_user_data(req.session.user, req.body.fistname, req.body.lastname, req.body.phone);
    if (err) {
        res.send(err.message);
    } else {
        res.send('0. Success');
    }
});
router.post('/edit_email', auth.restrict_login, async (req, res) => {
    const edited_email = req.body.email;
    const err = undefined; //funkcja zapisująca w bazie
    if (err) {
        res.send(err.message);
    } else {
        res.send('0. Success');
    }
});
router.post('/edit_password', auth.restrict_login, async (req, res) => {
    const edited_user = req.body.email;
    //tutaj bardziej skomplikowanie bo jeszcze hashowanie i weryfikacja

    const err = undefined; //funkcja zapisująca w bazie
    if (err) {
        res.send(err.message);
    } else {
        res.send('0. Success');
    }
});