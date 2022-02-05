const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const typedef = require('../typedef');
const Sort = typedef.sort;

// lista ID porduktów do wyświetlenia na stronie głównej
recommended_ids = [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

router.get('/', async (req, res) => {

  display = [];

  // zebranie wszystkich produktów
  for( id of recommended_ids ) {
    display[display.length] = await database.get_product_by_id(id);
  }

  console.log(display[0])

  res.render('index', {
    display: display
  });

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