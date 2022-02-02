const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const auth = require('../bin/auth');
const typedef = require('../typedef');
const Role = typedef.role;

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/create', auth.restrict_login, auth.restrict_role(Role.Admin), (req, res) => {
    //OK
    try {
        res.render('product/create-product');

    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.get('/:id',  async (req, res) => {
    try {
        const product = await database.get_product_by_id(req.params.id);
        let render_obj = {
            product: product,
            recommended: await database.get_recemended_products_in_subcategory(product.subcat_id),
            subcat_info: await database.get_position_of_subcategory(product.subcat_id)
        }
        if(res.locals.user_role === Role.Admin){
            render_obj.cats = await database.get_categories();
            render_obj.subcats = await database.get_subcategories();
            res.render('product/edit-product', render_obj);
        } else {
            res.render('product/product', render_obj);
        }
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});

router.post('/',  auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    try {
        const filters = await database.get_filters_by_subcategory(req.body.subcat_id);
        let params = [];
        for (const filter of filters) {
            if(req.body[filter.name]) {
                params.push({id: filter.id, value: req.body[filter.name]});
            } 
        }
        console.log(req.body);
        console.log(params);
        const product = {
            id: req.body.id,
            subcat_id: req.body.subcat_id,
            name: req.body.name,
            price: req.query.price,
            desc: req.body.desc,
            imgurl: req.body.imgurl,
            brand: req.query.brand,
            params: params
        }
        await database.update_product(product);
        req.session.error = '0. Success';
        res.redirect(`p/${req.body.id}`);

    } catch (err) {
        req.session.error = err.message;
        res.redirect(`p/${req.body.id}`);
    }
});


router.post('/add',  auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    //OK
    try {
        const filters = await database.get_filters_by_subcategory(req.body.subcat_id);
        let params = [];
        for (const filter of filters) {
            if(req.body[filter.name]) {
                params.push({id: filter.id, value: req.body[filter.name]});
            } 
        }
        const product = {
            subcat_id: +req.body.subcat_id,
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            imgurl: req.body.imgurl,
            brand: req.body.brand,
            params: params
        }
        const prod_id = await database.add_product(product);
        req.session.error = '0. Success';
        res.redirect(`/p/${prod_id}`);

    } catch (err) {
        req.session.error = err.message;
        res.redirect(`/error`);
    }
});
router.post('/params',  auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    //OK
    try {
        const filters = await database.get_filters_by_subcategory(req.body.id);
        res.send(filters);

    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});
router.post('/:id/del',  auth.restrict_login, auth.restrict_role(Role.Admin), async (req, res) => {
    //OK
    try {
        await database.del_product(req.params.id);
        res.send({Response:'0. Success'});
    } catch (err) {
        req.session.error = err.message;
        res.redirect(`p/${req.params.id}`);
    }
});