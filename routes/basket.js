const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const typedef = require('../typedef');
const Sort = typedef.sort;
const Filter_type = typedef.filter_type;


router.get('/', async (req, res) => {
  try {   
    let products = [];
    if(req.session.user) {
      products = await database.get_products_to_basket(req.session.user);
    } else if (req.cookies.basket) {
      for( info of req.cookies.basket) {
        let product = await database.get_product_to_basket(info.id);
        product.quantity = indo.quantity;
        products.push(product);
      }
    }
    const render_obj = {
      products: products
    }
    res.render('basket', render_obj);
} catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
}
})

module.exports = router;
