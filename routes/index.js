const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const typedef = require('../typedef');
const Sort = typedef.sort;

router.get('/', async (req, res) => {
  try {
    // lista ID porduktów do wyświetlenia na stronie głównej
    const recommended_ids = [1, 2, 3, 5]
    let display = [];

    // zebranie wszystkich produktów
    for (id of recommended_ids) {
      const products = await database.get_recemended_products_in_subcategory(id);
      for (const product of products) {
        display.push(product);
      }
    }

    res.render('index', { display: display });
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
  }
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
      search: req.query.search,
      sort_by: sort_by,
      sort_opt: Sort,
      per_page: per_page,
      page: page,
      products: await database.find_products(req.query.search, sort_by, per_page, page, req.query['price-min'], req.query['price-max'], req.query['producer']),
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