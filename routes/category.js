const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
module.exports = router;

const database = require('../database/database');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id', async (req, res) => {
    try {
        res.render('products_list/products_list');
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }










    //strona kategorii
    /**
     * Tutaj powinno być wyświetlane określona liczba produktów z wybranej kategorii powiedzmy domyslnie 40 (możemy umożliwić userowi zmianę wtedy wysłaj w GET jakąś zmienną z taką daną)
     * przełącznie na następną stronę (GET z numerem strony) - ładuje kolejne x produktów
     * Powinno być menu boczne pozwalające wybrać podkategorię 
     * Powinien być formularz z parametrami do wyboru domyślne widoczne zawsze jak cena oraz parametry zależne od podkategorii
     * 
     * To samo tyczy się podkategorii
     * 
     * 
     *  Przekazywany objekt do widoku 
     *     product = typ{Product[]} - definicja w database
     *     proporties = zwraca własności po jakich może się odbywać sortowanie w tej kategorii do uzgodnienia z michałem
     */

    // const render_obj = {};
    // render_obj.product = await database.get_products_by_category(req.params.id);
    // render_obj.proporties = await database.get_proporties_by_subcategory(req.params.id);
    // //render_obj. ile na stronie = 40
    // //render_obj. reszta informacji po jakich było sortowanie i wyszukiwanie
    // res.send('kategoria o id:' + req.params.id);
});

//tu powinna być obsługa podkategorii