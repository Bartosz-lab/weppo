const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const typedef = require('../typedef');
const Sort = typedef.sort;

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/error', (req, res) => {
  res.render('./error');
});

router.get('/search', async (req, res) => {
  try {   
    const sort_by = (req.query.sort_by) ? req.query.sort_by : Sort.price_asc;
    const per_page = (req.query.per_page) ? req.query.per_page : 30;
    const page = (req.query.page) ? req.query.page : 1;

    const render_obj = {
        sort_by: sort_by,
        per_page: per_page,
        page: page,
        products: await database.find_products(req.query.search, sort_by, per_page, page,req.query['price-min'], req.query['price-max'], req.query['producer']),
        filters: [],
        price_min: req.query['price-min'],
        price_max: req.query['price-max'],
        producer: req.query['producer']
    };
    res.render('products-list/products-search', render_obj);
} catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
}
})