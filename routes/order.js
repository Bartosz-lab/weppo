const express = require('express');
const router = express.Router();
module.exports = router;

const auth = require('../bin/auth');
const typedef = require('../typedef');
const Role = typedef.role;
const database = require('../database/database');


router.get('/', auth.restrict_login, (req, res) => {
    switch (req.session.role) {
        case role.Admin:
            res.send('lista zamówień Admin');
            break;
        case role.Seller:
            res.send('lista zamówień sprzedawca');
            break;
        case role.Customer:
            res.send('lista zamówień koń');
            break;
        default:
            res.send('Error');
    }
});


router.get('/new', auth.restrict_login, auth.restrict_role(Role.Customer), async (req, res) => {
    try {
        let products = [];
        if (req.cookies.basket) {
            for (info of req.cookies.basket) {
                let product = await database.get_product_to_basket(info.id);
                product.quantity = info.quantity;
                products.push(product);
            }
        }
        const render_obj = {
            products: products,
            user: await database.get_user_info_by_id(req.session.user),
            adress: await database.get_adress_by_user_id(req.session.user)
        }
        res.render('./new_order', render_obj);
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});
router.post('/new', auth.restrict_login, auth.restrict_role(Role.Customer), async (req, res) => {
    try {
        if (!req.cookies.basket) {
            throw new Error('4. Something went wrong');
        }
        let products = [];
        for (info of req.cookies.basket) {
            const product = {
                id: info.id,
                price: await database.get_product_price(info.id),
                quantity: info.quantity
            }
            products.push(product);
        }
        const order = {
            products: products,
            user_id: req.session.user,
            user_info: {
                name: req.body.firstname, 
                surname: req.body.lastname, 
                phone: req.body.phone,
                email: req.body.email,
            },
            address: {
                street: req.body.street,
                nr_house: req.body.nr_house,
                nr_flat: req.body.nr_flat,
                zip_code: req.body.zip_code,
                city: req.body.city,
                country: req.body.country
            }
        }
        await database.add_order(order);
        res.redirect('/order/folded');
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});
router.get('/folded', auth.restrict_login, auth.restrict_role(Role.Customer), async (req, res) => {
    res.render('./new_order_folded');
});

router.get('/:id', auth.restrict_login, (req, res) => {
    //strona zamówienia potrzebna weryfkacja czy zamówienie jest tego użytkownika
    res.render('order', {
        orders: null,
        id: req.params.id,
        items: items,

    })
});