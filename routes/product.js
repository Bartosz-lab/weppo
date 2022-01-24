const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');

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
    res.render('product', {
        id: req.params.id,
        editable: false, //widok dla admina z edycją
        name: "Wasteland",
        price: 50,
        imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.angrymetalguy.com%2Fwp-content%2Fuploads%2F2018%2F09%2FPress_Cover_01-1.jpg&f=1&nofb=1",
        desc: "I'm your lie\n\
                I am your pretending\n\
                I'm the cause\n\
                Of your shame and anger<br>\
                \n\
                I'm your crime\n\
                Swept under the carpet\n\
                Your vanity\n\
                With all consequences",
        display: [
            { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum Lorem Ipsum  Lorem Ipsum", price: 5000 },
            { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.AFt6jAmiSg_OdO67WkA0CgHaD3%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000 },
            { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000 },
            { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum Lorem Ipsum  Lorem Ipsum", price: 5000 }
        ]
    });
});