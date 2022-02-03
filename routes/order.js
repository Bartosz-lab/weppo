const express = require('express');
const router = express.Router();
module.exports = router;

const auth = require('../bin/auth');
const typedef = require('../typedef');
const Role = typedef.role;
const Order_status = typedef.order_status;
const database = require('../database/database');


router.get('/', auth.restrict_login, async (req, res) => {
    try {
        
        switch (req.session.role) {
            case Role.Admin:
                await seller_function();
                break;
            case Role.Seller:
                await seller_function();
                break;
            case Role.Customer:
                const orders = await database.get_user_orders(req.session.user);
                res.render('orders', {orders: orders});
                break;
            default:
                throw new Error('4. Something went wrong');
        }
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
    async function seller_function() {
        const orders = await database.get_uncomplited_orders();
        res.render('orders-admin', {orders: orders});
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
        let price = 0;
        for (info of req.cookies.basket) {
            const product = {
                id: info.id,
                price: await database.get_product_price(info.id),
                quantity: info.quantity
            }
            price += product.price * product.quantity;
            products.push(product);
        }
        const order = {
            user_id: req.session.user,
            products: products,
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
            },
            status: Order_status.new,
            price: price,
            date: new Date()
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

router.get('/:id', auth.restrict_login, async (req, res) => {
    try {
        const order = await database.get_order_by_id(req.params.id);
        switch (req.session.role) {
            case Role.Admin:
                res.render('order-admin', {order: order, Order_status: Order_status});
                break;
            case Role.Seller:
                res.render('order-admin', {order: order, Order_status: Order_status});
                break;
            case Role.Customer:
                if(req.session.user != order.user_id) {
                    throw new Error('1. Access deined');
                } 
                res.render('order', {order: order});
                break;
            default:
                throw new Error('4. Something went wrong');
        }
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});
router.post('/:id', auth.restrict_login, async (req, res) => {
    try {
        const order = await database.get_order_by_id(req.params.id);
        if (!(req.session.role != Role.Admin) && !(req.session.role != Role.Seller)) {
            throw new Error('1. Access deined');
        }
        await database.update_order_status(id, req.body.status);
        req.session.error = '0. Success';
        res.redirect(`order/${req.params.id}`);
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});