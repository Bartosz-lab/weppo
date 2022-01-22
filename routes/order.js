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

items = [
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum Lorem Ipsum  Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.AFt6jAmiSg_OdO67WkA0CgHaD3%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000 },
    { count: 2, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000 },
    { count: 3, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum Lorem Ipsum  Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.progarchives.com%2Fwallpapers%2FRUSHCOLLAGE.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum Lorem Ipsum  Lorem Ipsum", price: 5000 },
    { count: 5, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9y2kjK5P_qFYJq3CMIMCcgHaHa%26pid%3DApi&f=1", desc: "Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shortlist.com%2Fmedia%2Fimages%2F2019%2F05%2Fthe-50-greatest-rock-albums-ever-3-1556678339-s1A3-column-width-inline.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000 },
    { count: 2, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.redroll.com%2Fwp-content%2Fuploads%2F2018%2F07%2Fprogrock1.jpg&f=1&nofb=1", desc: "Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000 },
    { count: 1, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", name: "Komp", imgurl: "images/test.png", desc: "Lorem Ipsum", price: 5000 }
  ] 

router.get('/:id', auth.restrict_login, (req, res) => {
    //strona zamówienia potrzebna weryfkacja czy zamówienie jest tego użytkownika
    res.render('order', {
        orders: null,
        id: req.params.id,
        items: items,

    })
});