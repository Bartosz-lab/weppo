const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');
const role = require('../bin/role');
const database = require('../bin/database');


router.get('/', auth.restrict_login, auth.restrict_role(role.Customer), async (req, res) => {
    /**
     *  Lista adresów zawierająca obok każdego adresu guzik edytuj (w przypadku wielu może być podział na podstrony [muszę jescze ogarnąć jak to zrealizować])
     * Przekazywany objekt do widoku 
     *     adress = typ{Adress[]} - definicja w database
     */
     const render_obj = {};
     render_obj.adress = await database.get_adresses_by_user_id(req.session.user);
    res.send('Lista adresów użytkownika');
});

router.get('/:id', auth.restrict_login, auth.restrict_role(role.Customer), async (req, res) => {
    /**
     *  Formularz zawierający pola edycji adresu wysyłany na ten sam adres
     * Przekazywany objekt do widoku 
     *     adress = typ{Adress} - definicja w database
     */
     const render_obj = {};
     render_obj.adress = await database.get_adress_by_id(req.params.id);
     //tutaj powinna być weryfikacja czy user może zobaczyć ten adres
    res.send('Adres nr '+ req.params.id);
});