const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../bin/database');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id',  async (req, res) => {
    //strona produktu
    /**
     * Powinna być cena oraz cała reszta informacji wraz z własnościami i ich nazwami
     *  Przekazywany objekt do widoku 
     *     product = typ{Product} - definicja w database
     *     proporties -nie wiem czy tu są potrzebne daj znać
     */

     const render_obj = {};
     render_obj.product = await database.get_products_by_category(req.params.id);
     render_obj.proporties = await database.get_proporties_by_subcategory(req.params.id);
    res.send('produkt o id:' + req.params.id);
});