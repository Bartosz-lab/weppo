const express = require('express');
//const { database } = require('pg/lib/defaults');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const database = require('../database/database');


router.get('/', auth.restrict_login, async (req, res) => {
    /**
     * Na tej stronie mogą się wyświetlać bloki:
     *  1. Dane użytkownika z guzikiem edytuj 
     *          (przekierowanie na stronę edycji [/account/settings]
     *          lub uruchomienie formularza pozwalającego na edycję danych[wysylamy formularz na adres /settings ktory przekieruje spowrotem na tą stronę]. )
     *  2. Twoje adresy wyświetlający 2-3 adresy każdy posiadający guzik edytuj oraz guzik pokaż wszystkie
     *  3. Zmiana emaila z guzikiem edytuj uruchamiający formularz wysyłany na [/account/edit_mail]
     *  4. Zmiana hasła z guzikiem edytuj uruchamiający formularz wysyłany na [/account/edit_password]
     *  
     * Jeśli myślisz że coś z tego nie ma sensu daj znać
     * 
     * Przekazywany objekt do widoku 
     *     user- typ {User_info} - definicja w database
     *     adress = typ{Adress[]} - definicja w database
     */
    let render_obj = {};
    render_obj.user = await database.get_user_info_by_id(req.session.user);
    render_obj.adress = await database.get_adresses_by_user_id(req.session.user);
    if(render_obj.user){
        res.render('account', render_obj);
    } else {
        //tutaj trzeba wrócić
        res.send("Error");
    }
});

router.get('/settings', auth.restrict_login, (req, res) => {
    /**
     * Jeśli decydujemy się na tą opcje (patrz wyżej) to przekazany zostaje tylko objekt user_info
     */
    res.render('accountSettings', { 
        name: "Jan", 
        surname: "Kowalski", 
        email: "jkowalski@gmail.com", 
        adress: "Nędza Wieś", 
        tel: "123456789"
    });
});

//tutaj powinna być obsługa formularzy POST dla formularzy o których mowa wyżej